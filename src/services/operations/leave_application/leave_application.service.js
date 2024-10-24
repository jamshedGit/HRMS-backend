const httpStatus = require("http-status");
const { LeaveApplicationModel, LeaveApplicationDetailModel, EmployeeProfileModel, LeaveTypeModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, formatDates, addDaysInDate, getDateDiffInDays, handleNestedData } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { include } = require("underscore");

const Op = Sequelize.Op;

//Attributes required for Leave Application Table view
const leaveApplicationAttributes = [
  'from',
  'to',
  'remarks',
  'leaveType',
  'file',
  'days',
  'Id',
  'isActive'
]

/**
 * Create Leave Application
 * 
 * @param {Object} req 
 * @returns 
 */
const createleaveApplication = async (req) => {
  const body = req.body;
  const employeeData = await EmployeeProfileModel.findByPk(body.employeeId, { attributes: ['subsidiaryId', 'Id'] })
  if (!employeeData) {
    throw new ApiError(httpStatus.NOT_FOUND, `No User Found`);
  }
  const oldRecord = await getleaveApplicationData(
    {
      employeeId: body.employeeId,
      isActive: true,
      [Sequelize.Op.or]: [
        {
          from: { [Sequelize.Op.between]: [body.from, body.to] }
        },
        {
          to: { [Sequelize.Op.between]: [body.from, body.to] }
        },
        {
          from: { [Sequelize.Op.lte]: body.from },
          to: { [Sequelize.Op.gte]: body.to }
        }
      ]
    }
  )
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, `Already have leave present for following dates ${formatDates(oldRecord.from)} - ${formatDates(oldRecord.to)}`);
  }
  const payload = {
    ...body,
    createdBy: req.user.id,
    // companyId: 1,
    days: getDateDiffInDays(body.from, body.to)
    // subsidiaryId: employeeData.subsidiaryId,
  };
  const createdData = await LeaveApplicationModel.create(payload);
  if (createdData) {
    const numberOfRecords = createdData.days;
    const detailData = [];
    for (let i = 0; i < numberOfRecords; i++) {
      detailData.push({
        applicationId: createdData.Id,
        date: addDaysInDate(createdData.from, i),
        createdBy: req.user.id
      })
    }

    await LeaveApplicationDetailModel.bulkCreate(detailData)
  }
  return await getleaveApplicationData({ Id: createdData.Id }, leaveApplicationAttributes, [{ model: LeaveTypeModel, attributes: ['name'] }], true);;
};


/**
 * 
 * Get All Leave Applications with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllleaveApplication = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber', 'employeeId']);
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const { count, rows } = await LeaveApplicationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      employeeId: options.employeeId,
      isActive: true
    },
    include: [{ model: LeaveTypeModel, attributes: ['name'] }],
    attributes: leaveApplicationAttributes,
    offset: offset,
    limit: limit,
  });

  const updatedRows = handleNestedData(rows);
  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};


/**
 * Get Single Leave Application By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getleaveApplicationById = async (id, attributes = null) => {
  return LeaveApplicationModel.findByPk(id, {
    attributes: attributes || leaveApplicationAttributes,
  });
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getleaveApplicationData = async (filters, attributes = null, include = null, handleNested = false) => {
  const options = {};
  if (filters) {
    options.where = filters
  }
  if (attributes) {
    options.attributes = attributes
  }
  if (include) {
    options.include = include
  }

  if (handleNested) {
    const data = await LeaveApplicationModel.findOne(options);
    return handleNestedData(data)
  }
  return await LeaveApplicationModel.findOne(options);
};


/**
 * Update Single Leave Application By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateleaveApplicationById = async (body, updatedBy) => {
  const oldRecord = await getleaveApplicationById(body.Id)
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save({ fields: ['remarks', 'file'] });
  const data = await getleaveApplicationById(updatedData.Id, leaveApplicationAttributes)
  return data;
};

/**
 * Delete Single Leave Application Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteleaveApplicationById = async (id) => {
  const oldRecord = await getleaveApplicationById(id);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  Object.assign(oldRecord, { isActive: false })
  await oldRecord.save({ fields: ['isActive'] });
  await LeaveApplicationDetailModel.update({ isActive: false }, {
    where: {
      applicationId: oldRecord.Id
    }
  })
  return oldRecord;
};

module.exports = {
  getAllleaveApplication,
  getleaveApplicationById,
  updateleaveApplicationById,
  deleteleaveApplicationById,
  createleaveApplication
};

const httpStatus = require("http-status");
const { LeaveApplicationModel, LeaveApplicationDetailModel, EmployeeProfileModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, formatDates } = require("../../../utils/common");
const pick = require("../../../utils/pick");

const Op = Sequelize.Op;

//Attributes required for Leave Application Table view
const leaveApplicationAttributes = [
  'typeName',
  'type',
  'code',
  'name',
  'Id',
  'isActive',
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
  const oldRecord = await getleaveApplicationData({
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
  })
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, `Already have leave present for following dates ${formatDates(oldRecord.from)} - ${formatDates(oldRecord.to)}`);
  }
  const payload = {
    ...body,
    createdBy: req.user.id,
    companyId: 1,
    subsidiaryId: employeeData.subsidiaryId,
  };
  const createdData = await LeaveApplicationModel.create(payload);
  // const data = await getleaveApplicationById(createdData.Id, leaveApplicationAttributes);
  return employeeData;
};


/**
 * 
 * Get All Leave Applications with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllleaveApplication = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get search field value for filtering
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await LeaveApplicationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    attributes: leaveApplicationAttributes,
    offset: offset,
    limit: limit,
  });

  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, rows);
};


/**
 * Get Single Leave Application By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getleaveApplicationById = async (id, options = null) => {
  return LeaveApplicationModel.findByPk(id, {
    attributes: options || [
      'typeName',
      'type',
      'code',
      'name',
      'Id',
      'isActive',
    ],
  });
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getleaveApplicationData = async (filters, attributes = null, include = null) => {
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
  if (FORBIDDEN_CODES.includes(body.code)) {
    throw new ApiError(httpStatus.FORBIDDEN, `This code is forbidden ${body.code}. Please use another code`);
  }
  let oldRecord = await getleaveApplicationData({ code: body.code });
  if (oldRecord && oldRecord.Id != body.Id) {
    throw new ApiError(httpStatus.FORBIDDEN, `Code already in use ${body.code}. Please use another code`);
  }
  else {
    oldRecord = await getleaveApplicationById(body.Id)
  }
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
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
  await oldRecord.destroy();
  return oldRecord;
};

module.exports = {
  getAllleaveApplication,
  getleaveApplicationById,
  updateleaveApplicationById,
  deleteleaveApplicationById,
  createleaveApplication
};

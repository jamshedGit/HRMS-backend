const httpStatus = require("http-status");
const { LeaveTypeModel, SubsidiaryModel, LeaveTypeModelAccess } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, currentSubsidiaryPermission } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { LEAVE_TYPE, FORBIDDEN_CODES } = require("../../../models/operations/leave_type/enum/leave_type.enum");

const Op = Sequelize.Op;

//Attributes required for Leave Type Table view
const leaveTypeAttributes = [
  'typeName',
  'type',
  'code',
  'name',
  'Id',
  'isActive',
  'subsidiaryId'
]

/**
 * Create Leave Type
 * 
 * @param {Object} req 
 * @returns 
 */
const createLeaveType = async (req) => {
  if (FORBIDDEN_CODES.includes(req.body.code)) {
    throw new ApiError(httpStatus.FORBIDDEN, `This code is forbidden ${req.body.code}. Please use another code.`);
  }
  const oldRecord = await getLeaveData({
    code: req.body.code
  })
  if (oldRecord) {
    throw new ApiError(httpStatus.FORBIDDEN, `Code ${req.body.code} already in use.`);
  }
  const payload = {
    ...req.body,
    createdBy: req.user.id,
    typeName: LEAVE_TYPE[req.body.type]
  };
  const createdData = await LeaveTypeModel.create(payload);
  if (createdData) {
    for (const subId of createdData.subsidiaryId) {
      await LeaveTypeModelAccess.create({
        leaveTypeId: createdData.Id,
        subsidiaryId: subId,
      })
    }
  }
  const data = await getLeaveTypeById(createdData.Id, leaveTypeAttributes);
  return data;
};


/**
 * 
 * Get All Leave Types with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllLeaveType = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get search field value for filtering
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('t_leave_type.name')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await LeaveTypeModel.findAndCountAll({
    // order: [
    //   ['createdAt', 'DESC']
    // ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    include: [{
      model: LeaveTypeModelAccess,
      where: {
        subsidiaryId: {
          [Op.in]: await currentSubsidiaryPermission(req)  // Filter banks based on subsidiaryId
        },
      },
      required:true,
      attributes:[]
    }],
    attributes: leaveTypeAttributes,
    offset: offset,
    limit: limit,
  });

  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, rows);
};


/**
 * Get Single Leave Type By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getLeaveTypeById = async (id, options = null, include = []) => {
  return LeaveTypeModel.findByPk(id, {
    attributes: options || [
      'typeName',
      'type',
      'code',
      'name',
      'Id',
      'isActive',
      'subsidiaryId'
    ],
    include: include
  });
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getLeaveData = async (filters, attributes = null, include = null) => {
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

  return await LeaveTypeModel.findOne(options);
};


/**
 * Update Single Leave Type By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateLeaveTypeById = async (body, updatedBy) => {
  if (FORBIDDEN_CODES.includes(body.code)) {
    throw new ApiError(httpStatus.FORBIDDEN, `This code is forbidden ${body.code}. Please use another code.`);
  }
  let oldRecord = await getLeaveData({
    code: body.code
  })
  if (oldRecord && oldRecord.Id != body.Id) {
    throw new ApiError(httpStatus.FORBIDDEN, `Code already in use ${body.code} for this Subsidiary.`);
  }
  else {
    oldRecord = await getLeaveTypeById(body.Id)
  }
  body.updatedBy = updatedBy;
  body.typeName = LEAVE_TYPE[body.type];
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  if (updatedData) {
    await LeaveTypeModelAccess.destroy({ where: { leaveTypeId: updatedData.Id } })
    for (const subId of updatedData.subsidiaryId) {
      await LeaveTypeModelAccess.create({
        leaveTypeId: updatedData.Id,
        subsidiaryId: subId,
      })
    }
  }
  const data = await getLeaveTypeById(updatedData.Id, leaveTypeAttributes)
  return data;
};

/**
 * Delete Single Leave Type Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteLeaveTypeById = async (id) => {
  const oldRecord = await getLeaveTypeById(id);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  await oldRecord.destroy();
  return oldRecord;
};

/**
 * 
 * Get Leave Type Dropdown Data
 * 
 * @returns 
 */
const getDropdownData = () => {
  return Object.keys(LEAVE_TYPE).map((type) => {
    return { label: LEAVE_TYPE[type], value: Number(type) }
  })
}

module.exports = {
  getAllLeaveType,
  getLeaveTypeById,
  updateLeaveTypeById,
  deleteLeaveTypeById,
  createLeaveType,
  getDropdownData
};

const httpStatus = require("http-status");
const { LeaveManagementConfigurationModel, LeaveTypePoliciesModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { leave_management_configuration, FORBIDDEN_CODES } = require("../../../models/operations/leave_management_configuration/enum/leave_management_configuration.enum");

const Op = Sequelize.Op;

//Attributes required for Leave Management Configuration Table view
const leaveManagementConfigurationAttributes = [
  'typeName',
  'type',
  'code',
  'name',
  'Id',
  'isActive',
]

/**
 * Create Leave Management Configuration
 * 
 * @param {Object} req 
 * @returns 
 */
const createleaveManagementConfiguration = async (req) => {
  const { leavetypePolicies, leaveTypeSalaryDeductionPolicies, ...payload } = req.body
  const createdData = await LeaveManagementConfigurationModel.create(payload);
  if (createdData){
    const createdPolicyData = await LeaveTypePoliciesModel.bulkCreate(leavetypePolicies.map((el)=> ({...el, leaveManagementConfigId: createdData.Id})))
    return {createdPolicyData, createdData};
  }
};


/**
 * 
 * Get All Leave Management Configuration with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllleaveManagementConfiguration = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get search field value for filtering
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await LeaveManagementConfigurationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      // [Op.or]: queryFilters,
      // isActive: true
    },
    include: [
      {
        model: LeaveTypePoliciesModel
      }
    ],
    // attributes: leaveManagementConfigurationAttributes,
    offset: offset,
    limit: limit,
  });

  return rows
  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, rows);
};


/**
 * Get Single Leave Management Configuration By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getleaveManagementConfigurationById = async (id, options = null) => {
  return leaveManagementConfigurationModel.findByPk(id, {
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
const getleaveManagementConfigurationData = async (filters, attributes = null, include = null) => {
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

  return await leaveManagementConfigurationModel.findOne(options);
};


/**
 * Update Single Leave Management Configuration By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateleaveManagementConfigurationById = async (body, updatedBy) => {
  if (FORBIDDEN_CODES.includes(body.code)) {
    throw new ApiError(httpStatus.FORBIDDEN, `This code is forbidden ${body.code}. Please use another code`);
  }
  let oldRecord = await getleaveManagementConfigurationData({ code: body.code });
  if (oldRecord && oldRecord.Id != body.Id) {
    throw new ApiError(httpStatus.FORBIDDEN, `Code already in use ${body.code}. Please use another code`);
  }
  else {
    oldRecord = await getleaveManagementConfigurationById(body.Id)
  }
  body.updatedBy = updatedBy;
  body.typeName = leave_management_configuration[body.type];
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  const data = await getleaveManagementConfigurationById(updatedData.Id, leaveManagementConfigurationAttributes)
  return data;
};

/**
 * Delete Single Leave Management Configuration Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteleaveManagementConfigurationById = async (id) => {
  const oldRecord = await getleaveManagementConfigurationById(id);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  await oldRecord.destroy();
  return oldRecord;
};

/**
 * 
 * Get Leave Management Configuration Dropdown Data
 * 
 * @returns 
 */
const getDropdownData = () => {
  return Object.keys(leave_management_configuration).map((type) => {
    return { label: leave_management_configuration[type], value: Number(type) }
  })
}

module.exports = {
  getAllleaveManagementConfiguration,
  getleaveManagementConfigurationById,
  updateleaveManagementConfigurationById,
  deleteleaveManagementConfigurationById,
  createleaveManagementConfiguration,
  getDropdownData
};

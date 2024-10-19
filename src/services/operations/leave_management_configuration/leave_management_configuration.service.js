const httpStatus = require("http-status");
const { LeaveManagementConfigurationModel, LeaveTypePoliciesModel, LeaveTypeSalaryDeductionPoliciesModel, EmployeeProfileModel, FormModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, handleNestedData } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { leave_management_configuration, FORBIDDEN_CODES } = require("../../../models/operations/leave_management_configuration/enum/leave_management_configuration.enum");

const Op = Sequelize.Op;

const includeData = [
  {
    model: LeaveTypePoliciesModel
  },
  {
    model: LeaveTypeSalaryDeductionPoliciesModel
  },
  {
    model: FormModel,
    as: 'subsidiary'
  },
  {
    model: FormModel,
    as: 'employeeType'
  },
  {
    model: FormModel,
    as: 'grade'
  },

]
//Include options required for Leave Management Configuration Table view
const LeaveManagementConfigurationInclude = [
  {
    model: FormModel,
    attributes: [['formName', 'subsidiaryName']],
    as: 'subsidiary',
  },
  {
    model: FormModel,
    as: 'employeeType',
    attributes: [['formName', 'employeeTypeName']]
  },
  {
    model: FormModel,
    as: 'grade',
    attributes: [['formName', 'gradeName']]
  },
]

//Attributes required for Leave Management Configuration Table view
const leaveManagementConfigurationAttributes = [
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
  if (createdData) {
    const createdPolicyData = await LeaveTypePoliciesModel.bulkCreate(leavetypePolicies.map((el) => ({ ...el, leaveManagementConfigId: createdData.Id })))
    const createdSalaryDeductionData = await LeaveTypeSalaryDeductionPoliciesModel.bulkCreate(leaveTypeSalaryDeductionPolicies.map((el) => ({ ...el, leaveManagementConfigId: createdData.Id })))
  }
  return await getleaveManagementConfigurationData({ Id: createdData.Id }, leaveManagementConfigurationAttributes, LeaveManagementConfigurationInclude, true)
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
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('formName')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await LeaveManagementConfigurationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    include: [
      {
        model: FormModel,
        attributes: [['formName', 'subsidiaryName']],
        as: 'subsidiary',
        where: {
          [Op.or]: queryFilters,
        }
      },
      {
        model: FormModel,
        as: 'employeeType',
        attributes: [['formName', 'employeeTypeName']]
      },
      {
        model: FormModel,
        as: 'grade',
        attributes: [['formName', 'gradeName']]
      },
    ],
    attributes: leaveManagementConfigurationAttributes,
    offset: offset,
    limit: limit,
  });
  const updatedRows = handleNestedData(rows)
  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};


/**
 * Get Single Leave Management Configuration By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getleaveManagementConfigurationById = async (id, options = null) => {
  return LeaveManagementConfigurationModel.findByPk(id);
};


const getleaveManagementConfigurationByForEdit = async (body) => {
  if (body) {
    const data = await getleaveManagementConfigurationData(
      { ...body },
      ['subsidiaryId', 'employeeTypeId', 'gradeId', 'weekend', 'isSandwich', 'Id'],
      [
        {
          model: LeaveTypePoliciesModel,
          attributes: ['Id', 'leaveType', 'gender', 'minExp', 'maxAllowed', 'attachmentRequired', 'maritalStatus']
        },
        {
          model: LeaveTypeSalaryDeductionPoliciesModel,
          attributes: ['Id', 'leaveType', 'minLeave', 'maxLeave', 'deduction', 'leaveStatus']
        }
      ]
    )
    if(!data){
      return null;
    }
    const{t_leave_type_policies, t_leave_type_salary_deduction_policies, ...rest} = data.dataValues;
    rest.leavetypePolicies = t_leave_type_policies || [];
    rest.leaveTypeSalaryDeductionPolicies = t_leave_type_salary_deduction_policies || [];
    rest.weekend = JSON.parse(rest.weekend || '[]')

    return rest
  }
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getleaveManagementConfigurationData = async (filters, attributes = null, include = null, handleNested = false) => {
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
    const data = await LeaveManagementConfigurationModel.findOne(options);
    return handleNestedData(data)
  }
  return await LeaveManagementConfigurationModel.findOne(options);
};


/**
 * Update Single Leave Management Configuration By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateleaveManagementConfigurationById = async (body, updatedBy) => {
  const { leavetypePolicies, leaveTypeSalaryDeductionPolicies, ...payload } = body
  oldRecord = await getleaveManagementConfigurationById(payload.Id)
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, payload);
  const updatedData = await oldRecord.save();
  if (updatedData) {
    leavetypePolicies.forEach(element => {
      element.updatedBy = updatedBy;
      LeaveTypePoliciesModel.upsert({ ...element, leaveManagementConfigId: updatedData.Id })
    });

    leaveTypeSalaryDeductionPolicies.forEach(element => {
      element.updatedBy = updatedBy;
      LeaveTypeSalaryDeductionPoliciesModel.upsert({ ...element, leaveManagementConfigId: updatedData.Id })
    });
  }
  return await getleaveManagementConfigurationData({ Id: updatedData.Id }, leaveManagementConfigurationAttributes, LeaveManagementConfigurationInclude, true);
};


/**
 * Delete Single Leave type Policy Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteLeaveTypePolicy = async (id) => {
  const oldRecord = await LeaveTypePoliciesModel.findByPk(id);;
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  await oldRecord.destroy();
  return oldRecord;
};


/**
 * Delete Single Leave type Policy Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteLeaveTypeDeductionPolicy = async (id) => {
  const oldRecord = await LeaveTypeSalaryDeductionPoliciesModel.findByPk(id);;
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  await oldRecord.destroy();
  return oldRecord;
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



module.exports = {
  getAllleaveManagementConfiguration,
  getleaveManagementConfigurationById,
  updateleaveManagementConfigurationById,
  deleteleaveManagementConfigurationById,
  createleaveManagementConfiguration,
  deleteLeaveTypeDeductionPolicy,
  deleteLeaveTypePolicy,
  getleaveManagementConfigurationByForEdit
};

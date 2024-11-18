const { AllocateLeavesModel, LeaveManagementConfigurationModel, LeaveTypePoliciesModel, LeaveTypeModel } = require("../../../models/index");
const Sequelize = require('sequelize');
const { POLICY_TYPE } = require("../../../models/operations/allocate_leaves/enum/allocate_leaves.enum");
const { allocateLeaveBalances } = require("../employee_leave_balance/employee_leave_balance.service");
const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");

const Op = Sequelize.Op;

//Attributes required for Allocate Leaves Table view
const allocateLeavesAttributes = [
  'leaveType',
  'leaveCount',
  'policyType',
  'maxCount',
  'Id',
]

/**
 * Create Allocate Leaves and Allocate Balances to Each Employee
 * 
 * @param {Object} req 
 * @returns 
 */
const createallocateLeaves = async (req) => {
  const { list, ...rest } = req.body;
  //This function is to check and throw error if allocated Count of any leave type exceeds it's maxAllowed Limit
  await checkLeaveTypeLimits(req.body);

  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    const payload = {
      ...rest,
      ...element,
      createdBy: req.user.id
    };
    await AllocateLeavesModel.upsert(payload);

  }
  const data = await getallocateLeavesData({ ...rest }, allocateLeavesAttributes);
  allocateLeaveBalances({ ...rest, list: data })
  return { ...rest, list: data };
};

/**
 * 
 * Get Allocated Leave Data By Filters
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllAllocateLeaves = async (req) => {
  const body = req.body;
  const data = await getallocateLeavesData({ ...body }, allocateLeavesAttributes);
  return { ...body, list: data };
}


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getallocateLeavesData = async (filters, attributes = null, include = null) => {
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

  return await AllocateLeavesModel.findAll(options);
};

/**
 * 
 * Get Policy Type Dropdown Data
 * 
 * @returns 
 */
const getDropdownData = () => {
  return Object.keys(POLICY_TYPE).map((type) => {
    return { label: POLICY_TYPE[type], value: Number(type) }
  })
}


/**
 * 
 * This function throws If Any Leave Type Allocated Count exceeds the maximum allowed for that leave type in Leave Management Configuration Policies
 * 
 * @param {Object} body 
 */
const checkLeaveTypeLimits = async (body) => {
  //Create Filter according For Leave Type Policy 
  const filters = body.list.map(el => {
    return {
      leaveType: el.leaveType,
      maxAllowed: { [Op.lt]: el.leaveCount },
    }
  })

  //This query will get data of Leave Type Policies that have Max Allowed less than the values entered in Allocation form.
  //If the limits are not exceeded this query shouldn't return data. If it does return then we throw error with Leave Type name and its maximum limt
  const leaveConfigData = await LeaveManagementConfigurationModel.findOne({
    where: {
      subsidiaryId: body.subsidiaryId,
    },
    attributes: [],
    include: [
      {
        model: LeaveTypePoliciesModel,
        where: {
          [Op.or]: filters
        },
        attributes: ['maxAllowed'],
        include: [
          {
            model: LeaveTypeModel,
            attributes: ['name']
          }
        ],
        required: true
      }
    ]
  })

  //Throw error only if limit exceeds.
  if(leaveConfigData?.t_leave_type_policies?.length){
    let message = 'Max allowed of Leave Types are: ';
    leaveConfigData.t_leave_type_policies.forEach((el)=> {
      message += `Max ${el.t_leave_type.name} can be ${el.maxAllowed} `
    })

    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
}

module.exports = {
  createallocateLeaves,
  getAllAllocateLeaves,
  getDropdownData
};

const httpStatus = require("http-status");
const { LeaveApplicationModel, EmployeeProfileModel, LeaveTypeModel, EmployeeLeaveBalanceModel, FiscalSetupModel, AllocateLeavesModel, LeaveEncashmentModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, handleNestedData } = require("../../../utils/common");
const pick = require("../../../utils/pick");

const Op = Sequelize.Op;

//Attributes required for Leave Application Table view
const leaveEncashmentAttributes = [
  'reason',
  'leaveType',
  'days',
  'Id',
  'isActive'
]

/**
 * Create Leave Encashment
 * 
 * @param {Object} req 
 * @returns 
 */
const createleaveEncashment = async (req) => {
  const body = req.body;

  //Get Employee Data by Employee Id with Employee Leave balances of current active fiscal year
  const employeeData = await EmployeeProfileModel.findByPk(body.employeeId,
    {
      attributes: ['Id', 'employeeTypeId', 'subsidiaryId', 'cycleTypeId'],
      include: [
        {
          model: EmployeeLeaveBalanceModel,
          where: {
            leaveType: body.leaveType,
            yearId: body.yearId,
            remainingCount: { [Op.gte]: body.days }
          },
          required: false,
          include: [
            {
              model: FiscalSetupModel,
              required: true,    // Ensures LeaveBalance is only included if FiscalSetup with isActive: true exists. This will only get data of Leave Balance whose fiscal year is currently active
              where: {
                isActive: true,
              },
            },
          ],
        }
      ]
    }
  )
  if (!employeeData) {
    throw new ApiError(httpStatus.NOT_FOUND, `No User Found`);
  }
  //Check if employee have leave balance remaining of this leave type
  if (!employeeData.t_employee_leave_balances?.length) {
    throw new ApiError(httpStatus.FORBIDDEN, `Remaining Leaves not enough`);
  }

  const policyData = await AllocateLeavesModel.findOne({
    where: {
      subsidiaryId: employeeData.subsidiaryId,
      cycleTypeId: employeeData.cycleTypeId,
      yearId: body.yearId,
      leaveType: body.leaveType,
      policyType: 2
    },
    attributes: ['maxCount']
  })

  if (!policyData) {
    throw new ApiError(httpStatus.FORBIDDEN, `Cannot Encash for this leave Type`);
  }
  
  const maxCountwithEnchashment = body.days + employeeData.t_employee_leave_balances[0].encashmentCount;
  if (policyData.maxCount < maxCountwithEnchashment ) {
    throw new ApiError(httpStatus.FORBIDDEN, `Maximum ${policyData?.maxCount - employeeData.t_employee_leave_balances[0].encashmentCount} leaves can be encashed for this type`);
  }

  const payload = {
    ...body,
    createdBy: req.user.id,
    subsidiaryId: employeeData.subsidiaryId,
  };

  //Create Leave Encashment if it's valid
  const createdData = await LeaveEncashmentModel.create(payload);
  if (createdData) {
    employeeData.t_employee_leave_balances[0].encashmentCount += createdData.days;
    employeeData.t_employee_leave_balances[0].remainingCount -= createdData.days;

    employeeData.t_employee_leave_balances[0].save();
  }
  return createdData
};


/**
 * 
 * Get All Leave Encashments with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllleaveEncashment = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber', 'employeeId', 'yearId']);
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const { count, rows } = await LeaveEncashmentModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      employeeId: options.employeeId,
      yearId: options.yearId,
      isActive: true
    },
    include: [{ model: LeaveTypeModel, attributes: ['name'] }],
    attributes: leaveEncashmentAttributes,
    offset: offset,
    limit: limit,
  });

  const updatedRows = handleNestedData(rows);
  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};


/**
 * Get Single Leave Encashment By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getleaveEncashmentById = async (id, attributes = null) => {
  return LeaveApplicationModel.findByPk(id, {
    attributes: attributes || leaveEncashmentAttributes,
  });
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getleaveEncashmentData = async (filters, attributes = null, include = null, handleNested = false) => {
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
 * Delete Single Leave Encashment Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteleaveEncashmentById = async (id) => {
  const oldRecord = await getleaveEncashmentById(id, ['Id', 'employeeId', 'leaveType', 'days']);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  //Set isActive to false for Leave Encashment
  Object.assign(oldRecord, { isActive: false })
  await oldRecord.save({ fields: ['isActive'] });

  //Get Leave Balance to update Leave Balance when Leave Encashment is deleted
  const leaveBalance = await EmployeeLeaveBalanceModel.findOne({
    where: {
      employeeId: oldRecord.employeeId,
      leaveType: oldRecord.leaveType,
    },
    include: [
      {
        model: FiscalSetupModel,
        required: true,    // Ensures LeaveBalance is only included if FiscalSetup with isActive: true exists
        where: {
          isActive: true,
        },
        attributes: ['Id']
      },
    ],
  })

  //Update Leave Balance
  if (leaveBalance && oldRecord.days) {
    leaveBalance.encashmentCount -= oldRecord.days;
    leaveBalance.remainingCount += oldRecord.days;

    leaveBalance.save();
  }


  return oldRecord;
};

module.exports = {
  getAllleaveEncashment,
  getleaveEncashmentById,
  deleteleaveEncashmentById,
  createleaveEncashment
};

const httpStatus = require("http-status");
const { AllocateLeavesModel, EmployeeProfileModel, LeaveApplicationModel, LeaveApplicationDetailModel, FiscalSetupModel, EmployeeLeaveBalanceModel, LeaveTypeModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, createFiscalYearLabel } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { POLICY_TYPE } = require("../../../models/operations/allocate_leaves/enum/allocate_leaves.enum");

const Op = Sequelize.Op;

//Attributes required for Allocate Leaves Table view
const leaveBalanceAttributes = [
  'allocatedCount',
  'availedCount',
  'remainingCount',
  'carryForwardCount',
  'lateCount',
  'encashmentCount',
  'Id',
]

const initialValues = {
  employeeId: '',
  leaveType: '',
  yearId: '',
  allocatedCount: 0,
  availedCount: 0,
  remainingCount: 0,
  carryForwardCount: 0,
  lateCount: 0,
  encashmentCount: 0,
}

/**
 * Allocate leave Balance
 * 
 * @param {Object} req 
 * @returns 
 */
const allocateLeaveBalances = async (data) => {
  const YearData = await FiscalSetupModel.findByPk(data.yearId, {
    attributes: ['startDate', 'endDate', 'Id']
  });
  console.log(':::::data::::::', JSON.stringify(data))
  const employeeData = await EmployeeProfileModel.findAll({
    where: {
      subsidiaryId: data.subsidiaryId,
      cycleTypeId: data.cycleTypeId
    },
    attributes: ['Id'],
    include: [
      {
        model: LeaveApplicationModel,
        required: false,
        attributes: ['Id', 'leaveType'],
        where: {
          from: { [Op.gte]: YearData.startDate }, // `from` date should be on or after startDate
          to: { [Op.lte]: YearData.endDate }      // `to` date should be on or before endDate
        },
        include: [
          {
            model: LeaveApplicationDetailModel,
            required: false,
            attributes: [
              'Id'
            ],
          }
        ]
      }
    ],
  })
  console.log(':::::employeeData::::::', JSON.stringify(employeeData))
  console.log(':::::YearData::::::', JSON.stringify(YearData))

  if (employeeData?.length) {
    data.list.forEach((al) => {
      employeeData.forEach(async (emp) => {
        const init = { ...initialValues };

        Object.assign(init, {
          employeeId: emp.Id,
          leaveType: al.leaveType,
          yearId: YearData.Id,
          allocatedCount: al.leaveCount
        });

        const availedCount = emp.t_leave_applications.reduce((prev, curr) => {
          if (curr.leaveType == al.leaveType) {
            return prev + (curr?.t_leave_application_details?.length || 0)
          }
          return prev
        }, 0)

        init.availedCount = availedCount;

        init.remainingCount = availedCount > init.allocatedCount ? 0 : init.allocatedCount - availedCount;
        if (al.policyType == POLICY_TYPE[2])
          init.encashmentCount = init.remainingCount > al.maxCount ? al.maxCount : init.remainingCount;


        const [affectedCount] = await EmployeeLeaveBalanceModel.update(
          { ...init }, // new values to update
          {
            where: { employeeId: init.employeeId, leaveType: init.leaveType, yearId: init.yearId } // condition to find the record
          }
        );

        // Check if any records were updated
        if (affectedCount === 0) {
          // If no record was updated, create a new record
          await EmployeeLeaveBalanceModel.create({
            ...init // values to set for the new record
          });
        }
      })

    })
  }

};

/**
 * Create Leave Balance
 * 
 * @param {Object} req 
 * @returns 
 */
const createLeaveBalance = async (req) => {
  const body = req.body;
  const payload = { ...initialValues }

  const oldRecord = await getLeaveBalance({ employeeId: body.employeeId, leaveType: body.leaveType, yearId: body.yearId }, ['Id']);
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, "Record already present.");
  }

  Object.assign(payload, body)
  payload.createdBy = req.user.Id

  const YearData = await FiscalSetupModel.findByPk(body.yearId, {
    attributes: ['startDate', 'endDate', 'Id']
  });

  const employeeData = await EmployeeProfileModel.findAll({
    where: {
      Id: body.employeeId,
    },
    attributes: ['Id', 'subsidiaryId', 'cycleTypeId'],
    include: [
      {
        model: LeaveApplicationModel,
        required: false,
        attributes: ['Id', 'leaveType'],
        where: {
          from: { [Op.gte]: YearData.startDate }, // `from` date should be on or after startDate
          to: { [Op.lte]: YearData.endDate },      // `to` date should be on or before endDate
          leaveType: body.leaveType
        },
        include: [
          {
            model: LeaveApplicationDetailModel,
            required: false,
            attributes: [
              'Id'
            ],
          }
        ],

      }
    ],
  })


  if (employeeData?.length) {
    const employee = employeeData[0];
    const policyData = await AllocateLeavesModel.findOne({
      where: {
        subsidiaryId: employee.subsidiaryId,
        cycleTypeId: employee.cycleTypeId,
        yearId: body.yearId,
        leaveType: body.leaveType
      }
    })

    const availedCount = employee.t_leave_applications.reduce((prev, curr) => {
      if (curr.leaveType == body.leaveType) {
        return prev + (curr?.t_leave_application_details?.length || 0)
      }
      return prev
    }, 0)

    payload.availedCount = availedCount;

    payload.remainingCount = availedCount > payload.allocatedCount ? 0 : payload.allocatedCount - availedCount;
    if (policyData?.policyType == POLICY_TYPE[2])
      payload.encashmentCount = payload.remainingCount > policyData.maxCount ? policyData.maxCount : payload.remainingCount;

    const createdData = await EmployeeLeaveBalanceModel.create({
      ...payload // values to set for the new record
    });
    const data = await getLeaveBalance({ Id: createdData.Id }, leaveBalanceAttributes);
    return data;
  }
  else {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee Not Found.");
  }
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getLeaveBalance = async (filters, attributes = null, include = null) => {
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

  //If Include is present then the returned data from the other table are under the key of table name. So we use handleNestedData
  if (include) {
    const data = await EmployeeLeaveBalanceModel.findOne(options);
    return handleNestedData(data)
  }
  //otherwise just return the requested data as is
  return await EmployeeLeaveBalanceModel.findOne(options);
};

/**
 * 
 * Get All Leave Balance with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllLeaveBalance = async (req) => {
  const body = req.body;
  const leaveTypes = await LeaveTypeModel.findAll({
    where: {
      isActive: true
    },
    attributes: ['name', 'Id']
  })

  const employeeData = await EmployeeProfileModel.findByPk(body.employeeId,
    {
      attributes: ['Id'],
      include: [
        {
          model: EmployeeLeaveBalanceModel,
          required: false,
          attributes: [...leaveBalanceAttributes, 'leaveType'],
          include: [
            {
              model: FiscalSetupModel,
              required: true,    // Ensures LeaveBalance is only included if FiscalSetup with isActive: true exists
              where: {
                isActive: true,
              },
              attributes: ['startDate', 'endDate']
            },
          ],
        }
      ]
    }
  )

  const data = leaveTypes.map((lt)=> {
    const leaveData = employeeData.t_employee_leave_balances.find(lb => lb.leaveType == lt.Id);
    return {
      leaveTypeName: lt.name,
      yearName: leaveData?.t_fiscal_setup ? createFiscalYearLabel(leaveData.t_fiscal_setup.endDate, leaveData.t_fiscal_setup.startDate) : 'NA',
      allocatedCount: leaveData?.allocatedCount || 0,
      availedCount: leaveData?.availedCount || 0,
      remainingCount: leaveData?.remainingCount || 0,
      carryForwardCount: leaveData?.carryForwardCount || 0,
      lateCount: leaveData?.lateCount || 0,
      encashmentCount: leaveData?.encashmentCount || 0,
    }
  })
  return data
};

/**
 * Create Leave Balance
 * 
 * @param {Object} req 
 * @returns 
 */
const getLeaveBalanceByFilters = async (body) => {
  return await getLeaveBalance({ ...body }, leaveBalanceAttributes)
};

/**
 * Update Single Leave Balance By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateLeaveBalance = async (body, updatedBy) => {
  const oldRecord = await getLeaveBalance({ Id: body.Id });
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  const data = await getLeaveBalance({ Id: updatedData.Id }, leaveBalanceAttributes);
  return data;
};

module.exports = {
  allocateLeaveBalances,
  createLeaveBalance,
  getAllLeaveBalance,
  getLeaveBalanceByFilters,
  updateLeaveBalance
};

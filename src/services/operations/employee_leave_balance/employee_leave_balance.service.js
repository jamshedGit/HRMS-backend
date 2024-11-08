const httpStatus = require("http-status");
const { AllocateLeavesModel, EmployeeProfileModel, LeaveApplicationModel, LeaveApplicationDetailModel, FiscalSetupModel, EmployeeLeaveBalanceModel, LeaveTypeModel, LeaveEncashmentModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, createFiscalYearLabel } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { POLICY_TYPE } = require("../../../models/operations/allocate_leaves/enum/allocate_leaves.enum");

const Op = Sequelize.Op;

//Attributes required for Leave Balance UI view
const leaveBalanceAttributes = [
  'allocatedCount',
  'availedCount',
  'remainingCount',
  'carryForwardCount',
  'lateCount',
  'encashmentCount',
  'Id',
]

//Initial record values of Leave Balance
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
 * Allocate leave Balance to every employee 
 * 
 * @param {Object} data 
 * @returns 
 */
const allocateLeaveBalances = async (data) => {
  //Get Year start and end dates to get leaves of employee in between that year
  const YearData = await FiscalSetupModel.findByPk(data.yearId, {
    attributes: ['startDate', 'endDate', 'Id']
  });


  //Get Old Year data to get Old remaining leaves in case of carry forward
  const oldYearData = await FiscalSetupModel.findOne({
    where: {
      isActive: false
    },
    order: [['createdAt', 'DESC']],
    attributes: ['Id']
  });


  //Get All Employee according to subsidiary and cycletypeId that we get from allocations data
  //Also include Leave Application Details to check what leaves employee has taken in that year
  //We include Leave Balance as well to get Leave Balance of previous year that have leaves remaining so we can carry forward those leaves if that applies
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
          to: { [Op.lte]: YearData.endDate },      // `to` date should be on or before endDate
          isActive: true
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
      },
      {
        model: EmployeeLeaveBalanceModel,
        where: {
          yearId: oldYearData?.Id || '',
          remainingCount: { [Op.gte]: 0 }
        },
        required: false,
      }
    ],
  });

  if (employeeData?.length) {
    data.list.forEach(async (al) => {
      employeeData.forEach(async (emp) => {
        //Initialize values for Leave balance Record
        const init = { ...initialValues };

        //This is to check if there are any leaves remaining of last year of the same leave type that are to be carry forwarded or are to be encashed for old year
        if (emp.t_employee_leave_balances?.length) {
          const oldBalance = emp.t_employee_leave_balances.find(el => el.leaveType == al.leaveType);

          if (oldBalance) {
            const allocationPolicy = await AllocateLeavesModel.findOne({
              where: {
                subsidiaryId: data.subsidiaryId,
                cycleTypeId: data.cycleTypeId,
                yearId: oldYearData.Id,
                leaveType: al.leaveType,
              },
              attributes: ['policyType', 'maxCount']
            })

            if (allocationPolicy && oldBalance.remainingCount && allocationPolicy.maxCount) {
              //If Leaves are carry forwarded then they will be added to new year record
              if(POLICY_TYPE[allocationPolicy.policyType] == POLICY_TYPE[1]){
                init.carryForwardCount = oldBalance.remainingCount > allocationPolicy.maxCount ? allocationPolicy.maxCount : oldBalance.remainingCount;
              }
              //If leaves are encashed then they will be added to encashed key in the old balance record and a record of their encashment is created in Leave Encashment table
              else if(POLICY_TYPE[allocationPolicy.policyType] == POLICY_TYPE[2]){
                oldBalance.encashmentCount += oldBalance.remainingCount > allocationPolicy.maxCount ? allocationPolicy.maxCount : oldBalance.remainingCount;
                oldBalance.remainingCount -= oldBalance.encashmentCount;

                await oldBalance.save()

                const payload = {
                  subsidiaryId: data.subsidiaryId,
                  employeeId: emp.Id,
                  leaveType: al.leaveType,
                  yearId: oldYearData.Id,
                  days: oldBalance.encashmentCount,
                  reason: 'Leave Balance Encashment on year end',
                }

                await LeaveEncashmentModel.create(payload);
              }
            }
          }
        }

        //assigned fixed values to initialized values so we don't have to worry about them later
        Object.assign(init, {
          employeeId: emp.Id,
          leaveType: al.leaveType,
          yearId: YearData.Id,
          allocatedCount: al.leaveCount
        });

        //Get the number of Availed Leaves of Employee. If no leave is availed then it will set 0
        const availedCount = emp.t_leave_applications.reduce((prev, curr) => {
          if (curr.leaveType == al.leaveType) {
            return prev + (curr?.t_leave_application_details?.length || 0)
          }
          return prev
        }, 0)

        //Set availed count
        init.availedCount = availedCount;

        //Set remaining count
        init.remainingCount = availedCount > init.allocatedCount ? 0 : init.allocatedCount - availedCount;

        //Add carry forward count to remaining count if there are any leaves from previous year that are carry forwarded
        init.remainingCount += init.carryForwardCount

        //Try updating considering there is record that is already present.
        //if the record is updated then it will increase the affectedCount number. 
        //if there was no previous record found to update that means no record was affected so we will create new record in the check below
        //This way is used because Sequelize doesn't support upsert method with where option
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
 * Create Leave Balance Manually of an employee
 * 
 * @param {Object} req 
 * @returns 
 */
const createLeaveBalance = async (req) => {
  const body = req.body;
  const payload = { ...initialValues }

  //Check if Old record of leave balance is present then throw error
  const oldRecord = await getLeaveBalance({ employeeId: body.employeeId, leaveType: body.leaveType, yearId: body.yearId }, ['Id']);
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, "Record already present.");
  }

  Object.assign(payload, body)
  payload.createdBy = req.user.Id

  //Get Year data start date and end date so we can get leaves of that year of employee
  const YearData = await FiscalSetupModel.findByPk(body.yearId, {
    attributes: ['startDate', 'endDate', 'Id']
  });

  //Get Employee data with Leave Applications and Leaves detail so we can calculate how many leaves employee has already taken
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
          leaveType: body.leaveType,
          isActive: true
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

    //Get availed count
    const availedCount = employee.t_leave_applications.reduce((prev, curr) => {
      if (curr.leaveType == body.leaveType) {
        return prev + (curr?.t_leave_application_details?.length || 0)
      }
      return prev
    }, 0)

    //Set availed count
    payload.availedCount = availedCount;

    //set remaining count
    payload.remainingCount = availedCount > payload.allocatedCount ? 0 : payload.allocatedCount - availedCount;

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
 * Get All Leave Balances of Employee by Employee Id
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllLeaveBalance = async (req) => {
  const body = req.body;
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
              required: true,    // Ensures LeaveBalance is only included if FiscalSetup with isActive: true exists. This check will ensure that only leave balances of current year will be returned
              where: {
                isActive: true,
              },
              attributes: ['startDate', 'endDate']
            },
            {
              model: LeaveTypeModel,
              attributes: ['name', 'Id']
            }
          ],
        }
      ]
    }
  )

  const data = employeeData.t_employee_leave_balances.map((lb) => {
    return {
      leaveTypeName: lb?.t_leave_type?.name || '',
      leaveType: lb?.t_leave_type?.Id || '',
      yearName: lb?.t_fiscal_setup ? createFiscalYearLabel(lb.t_fiscal_setup.endDate, lb.t_fiscal_setup.startDate) : 'NA',
      allocatedCount: lb?.allocatedCount || 0,
      availedCount: lb?.availedCount || 0,
      remainingCount: lb?.remainingCount || 0,
      carryForwardCount: lb?.carryForwardCount || 0,
      lateCount: lb?.lateCount || 0,
      encashmentCount: lb?.encashmentCount || 0,
    }
  });

  return data
};

/**
 * get Leave Balance By Filters provided in body
 * 
 * @param {Object} body 
 * @returns 
 */
const getLeaveBalanceByFilters = async (body) => {
  return await getLeaveBalance({ ...body }, leaveBalanceAttributes)
};

module.exports = {
  allocateLeaveBalances,
  createLeaveBalance,
  getAllLeaveBalance,
  getLeaveBalanceByFilters,
};

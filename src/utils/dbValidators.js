const Sequelize = require('sequelize');
const sequelize = require("../config/db"); // Adjust based on your setup
const { formatDates } = require("./common");
const httpStatus = require('http-status');
const { HttpStatusCodes } = require('./constants');
const ApiError = require('./ApiError');
const { PayrollMonthModel, FormModel, EmployeeProfileModel } = require('../models');
const EmpSalaryModel = require('../models/operations/employee_salary_setup/employee_salary_setup.model');
const Op = Sequelize.Op;

/**
 * 
 * Get Date from Body to check if the date falls in the month that is either closed or is finalized by payroll. If that is the case then throw error
 * 
 * @param {Object} body  Data containing the date
 * @param {String} dateKey  The key on which the date is present in the data 
 * @param {String} monthError  Error to throw on Closed Month
 * @param {String} finalizedError Error to throw on finalized payroll
 */
async function checkMonthFinalizedStatus(body, dateKey, monthError, finalizedError) {
  //Get date and employee from the body
  const date = body?.[dateKey];
  const employeeId = body?.employeeId;

  if (date && employeeId) {
    //Format date to remove the time from it.
    const formattedDate = formatDates(date, 'yyyy-MM-dd')
    const query = `SELECT
    locking.isFinalized,
    emp.Id,
    emp.subsidiaryId,
    month.isActive
FROM
    t_employee_profile emp
LEFT JOIN t_payroll_month_setup MONTH ON
    month.subsidiaryId = emp.subsidiaryId AND '${formattedDate}' BETWEEN month.startDate AND month.endDate
LEFT JOIN t_payrollprocess_locking locking ON
    locking.MonthId = month.Id AND emp.payrollGroupId = locking.PayrollGroupId AND emp.subsidiaryId = locking.SubsidiaryId
WHERE
    emp.Id = ${employeeId}`

    //Get Data from the DB
    const [data] = await sequelize.query(query, {
      type: Sequelize.QueryTypes.RAW
    })

    //If not data for this employee is present then throw error as invalid employee
    if (!data.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Internal Server Error')
    }

    //If Month is closed then throw error
    if (data[0].isActive == 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, monthError)
    }

    const currentActivePayrollMonth = await PayrollMonthModel.findOne({
      where: {
        subsidiaryId: data[0].subsidiaryId,
        isActive: true
      },
      attributes: ['startDate']
    })

    if (currentActivePayrollMonth && currentActivePayrollMonth.startDate && new Date(formattedDate) < new Date(currentActivePayrollMonth.startDate)) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, monthError)
    }


    //If month is not closed but its payroll is finalized then throw error
    if (data[0].isFinalized) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, finalizedError)
    }
  }

}

const checkMonthFinalizedStatus2 = async (body, dateKey, monthError, finalizedError) => {
  // const allPayrollGroup = await FormModel.findAll({
  //   where: { isActive: true, parentFormID: 127, companyId: body.companyId },
  //   attributes: ['formName', 'Id', 'formCode']
  // });
  let currentMonth = await PayrollMonthModel.findOne({
    where: {
      subsidiaryId: body.subsidiaryId,
      isActive: true

    },
  });

  if (!currentMonth) {
    return true
  }

  const empSalary= await EmpSalaryModel.findAll({

    where: {
      approved:1
    },
    attributes: [
      "employeeId","approved"
    ],
  });

  const approvedEmployeeIds = empSalary.map(emp => emp.employeeId);
  const allPayrollGroup = await EmployeeProfileModel.findAll({

    where: {
      isActive: true,
      companyId: body.companyId,
      subsidiaryId: body.subsidiaryId,
      approvedForPayroll:1,
      Id: {
        [Sequelize.Op.in]: approvedEmployeeIds // Only employees whose salary is approved
      }
    },
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('payrollGroupId')), 'payrollGroupId']
    ],
  });
  const formattedData = allPayrollGroup.map(item => ({
    payrollGroupId: item.payrollGroupId
  }));

  
 
  let count = 0;

  for (const payrollGroup of formattedData) {
    let record = await sequelize.query(
      'SELECT * FROM t_payrollprocess_locking WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId AND PayrollGroupId = :PayrollGroupId',
      {
        replacements: { SubsidiaryId: body.subsidiaryId, PayrollGroupId: payrollGroup.payrollGroupId, MonthId: currentMonth.Id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (record[0]?.isFinalized) {

      count += 1;
    }



  }
  if (count != allPayrollGroup.length) {

    throw new Error('Payroll process of current Payroll month are not finalized.');
  }

}
module.exports = { checkMonthFinalizedStatus, checkMonthFinalizedStatus2 };

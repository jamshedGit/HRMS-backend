const { LeaveApplicationModel, EmployeeProfileModel, LeaveTypeModel, SubsidiaryModel, CompanyModel } = require("../../../models/index");
const Sequelize = require('sequelize');
const { paginationFacts, handleNestedData, formatDates, digitsToWords } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { startOfDay, endOfDay } = require("date-fns");
const generatePdf = require("../../../utils/pdf");
const ApiError = require("../../../utils/ApiError");
const httpStatus = require("http-status");
const sequelize = require("../../../config/db");
const { el } = require("date-fns/locale");

const Op = Sequelize.Op;

//Attributes required for Leave Application Table view
const leaveApplicationAttributes = [
  'from',
  'to',
  'remarks',
  'leaveType',
  [Sequelize.literal(`CASE WHEN file IS NOT NULL AND file != '' THEN 'Yes' ELSE 'No' END`), 'fileStatus'],
  'days',
  'Id',
  'isActive',
]

/**
 * 
 * Get All Leave Applications with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllRegisteredPayroll = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const filter = req?.body?.filter || {};
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;

  //Prepare Employee Table Filters if any
  const employeeFilter = {};

  if (filter.subsidiaryId) employeeFilter.subsidiaryId = filter.subsidiaryId;
  if (filter.departmentId) employeeFilter.departmentId = filter.departmentId;
  if (filter.reportTo) employeeFilter.reportTo = filter.reportTo;
  if (filter.gradeId) employeeFilter.gradeId = filter.gradeId;
  if (filter.designationId) employeeFilter.designationId = filter.designationId;
  if (filter.locationId) employeeFilter.locationId = filter.locationId;
  if (filter.attendanceType) employeeFilter.attendanceType = filter.attendanceType;
  if (filter.employeeId) employeeFilter.Id = filter.employeeId;
  if (filter.monthId) employeeFilter.monthId = filter.monthId;

  //If no filter is present then send back response with no data
  if (!Object.keys(employeeFilter).length) {
    return paginationFacts(0, limit, options.pageNumber, []);
  }

  const query = `SELECT 
    y.employeeCode AS EmployeeCode, 
    CONCAT(y.firstName, ' ', IFNULL(y.middleName, ''), ' ', IFNULL(y.lastName, '')) AS EmployeeName,
    z.shortFormat AS MonthName, 
    TransactionType, 
    CASE 
        WHEN TransactionType = 'Earning' THEN (SELECT e.earningName FROM t_employee_earning e WHERE x.earning_deduction_id = e.Id)
        WHEN TransactionType = 'Deduction' THEN (SELECT e.DeductionName FROM t_employee_deduction e WHERE x.earning_deduction_id = e.Id)
        WHEN TransactionType = 'LoanType' THEN (SELECT e.Name FROM t_loan_type_setup e WHERE x.earning_deduction_id = e.Id)
        ELSE ''
    END AS EarningName, 
    Amount_Actual 
FROM t_payrollearningdeduction X
INNER JOIN t_employee_profile y ON x.EmpId = y.Id
INNER JOIN t_payroll_month_setup z ON x.SubsidiaryId = z.subsidiaryId 
WHERE`;

  const countQuery = `SELECT COUNT(*) AS TotalCount
FROM t_payrollearningdeduction X
INNER JOIN t_employee_profile y ON x.EmpId = y.Id
INNER JOIN t_payroll_month_setup z ON x.SubsidiaryId = z.subsidiaryId 
WHERE`;

  const array = [];

  if (employeeFilter.subsidiaryId) {
    array.push(`(y.subsidiaryId = ${employeeFilter.subsidiaryId})`)
  }

  if (employeeFilter.departmentId) {
    array.push(`(y.departmentId = ${employeeFilter.departmentId})`)
  }

  if (employeeFilter.reportTo) {
    array.push(`(y.reportTo = ${employeeFilter.reportTo})`)
  }

  if (employeeFilter.gradeId) {
    array.push(`(y.gradeId = ${employeeFilter.gradeId})`)
  }

  if (employeeFilter.designationId) {
    array.push(`(y.designationId = ${employeeFilter.designationId})`)
  }

  if (employeeFilter.locationId) {
    array.push(`(y.locationId = ${employeeFilter.locationId})`)
  }

  if (employeeFilter.attendanceType) {
    array.push(`(y.attendanceType = ${employeeFilter.attendanceType})`)
  }

  if (employeeFilter.employeeId) {
    array.push(`(y.Id = ${employeeFilter.employeeId})`)
  }

  if (employeeFilter.monthId) {
    array.push(`(x.MonthId = ${employeeFilter.monthId})`)
  }



  const [data] = await sequelize.query(`${query} ${array.join(' AND ')} LIMIT ${limit} OFFSET ${offset};`, {
    type: Sequelize.QueryTypes.RAW
  })

  const [totalCount] = await sequelize.query(`${countQuery} ${array.join(' AND ')};`, {
    type: Sequelize.QueryTypes.RAW
  })


  //Send paginated data
  return paginationFacts(totalCount[0].TotalCount, limit, options.pageNumber, data);
};

/**
 * 
 * Get All Leave Applications with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllRegisteredPayrollForPdf = async (req) => {
  const filter = req?.body || {};
  const labels = filter?.labels || {};
  labels.currentUser = req.user?.email || '';

  //Prepare Employee Table Filters if any
  const employeeFilter = {};

  if (filter.subsidiaryId) employeeFilter.subsidiaryId = filter.subsidiaryId;
  if (filter.departmentId) employeeFilter.departmentId = filter.departmentId;
  if (filter.reportTo) employeeFilter.reportTo = filter.reportTo;
  if (filter.gradeId) employeeFilter.gradeId = filter.gradeId;
  if (filter.designationId) employeeFilter.designationId = filter.designationId;
  if (filter.locationId) employeeFilter.locationId = filter.locationId;
  if (filter.attendanceType) employeeFilter.attendanceType = filter.attendanceType;
  if (filter.employeeId) employeeFilter.Id = filter.employeeId;

  //Prepare Leave Application Table Filters if any
  let attendanceFilter = {};

  if (filter.from) {
    if (filter.to) {
      const startOfDayDate = startOfDay(new Date(filter.from));
      const endOfDayDate = endOfDay(new Date(filter.to));

      attendanceFilter = {
        [Op.and]: [
          { from: { [Op.lte]: endOfDayDate } },
          { to: { [Op.gte]: startOfDayDate } },
        ],
      }
    }
  }

  //If no filter is present then send back response with no data
  if (!Object.keys(employeeFilter).length && !filter.from) {
    throw new ApiError(httpStatus.BAD_REQUEST);
  }

  //Get data according to filters
  const rows = await LeaveApplicationModel.findAll({
    order: [
      ['from', 'ASC']
    ],
    where: {
      ...attendanceFilter,
      isActive: true
    },
    include: [
      {
        model: EmployeeProfileModel,
        where: employeeFilter,
        required: true,
        attributes: [
          [Sequelize.literal(`CONCAT(firstName, ' ', lastName)`), 'fullName'],
          'employeeCode'
        ]
      },
      { model: LeaveTypeModel, attributes: ['name'] },
      { model: SubsidiaryModel, attributes: [['name', 'subsidiaryName']] }
    ],
    attributes: leaveApplicationAttributes,
  });

  //Handle nested data that comes with include
  const updatedRows = handleNestedData(rows)

  const data = {
    filters: { ...labels },
    currentDate: formatDates(new Date(), 'dd/MMM/yyyy HH:ss'),
    leaves: updatedRows
  }

  const pdfStream = await generatePdf('leave_register.hbs', data);

  return pdfStream
};

const generatePaySlip = async (req) => {
  const filter = req?.body || {};
  const labels = filter?.labels || {};
  labels.currentUser = req.user?.email || '';

  if (!(filter.employeeId && filter.monthId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please Provide Employee and Month.');
  }

  const employeeDataQuery = `Select 
	  CONCAT(emppro.firstName, ' ', IFNULL(emppro.middleName, ''), ' ', IFNULL(emppro.lastName, '')) AS EmployeeName,
    emppro.employeeCode,
    desig.formName AS designationName,
    grade.formName AS gradeName,
    pm.month_days AS monthDays,
    sum.PresentDays AS paidDays,
    sum.LeaveDays AS leaveCount,
    sum.AbsentDays_LateCount AS lateCount,
    bank.Name AS bankName,
    sal.emp_bank_accNo AS accountNumber,
    sal.grossSalary,
    sal.basicSalary,
    comp.name AS companyName
from t_payrollemployees pe
LEFT JOIN t_attendancesummary sum ON sum.MonthId = pe.MonthId AND sum.EmpId = pe.EmpId
LEFT JOIN t_employee_profile emppro  ON emppro.Id = pe.EmpId
LEFT JOIN t_form_menu grade ON grade.Id = pe.gradeId
LEFT JOIN t_form_menu desig ON desig.Id = pe.designationId
LEFT JOIN t_payroll_month_setup pm ON pm.Id = pe.MonthId
LEFT JOIN t_bank bank ON bank.Id = pe.emp_bankId
LEFT JOIN t_employee_salary_benefits sal ON sal.employeeId = pe.EmpId
LEFT JOIN t_subsidiary sub ON sub.Id = pe.SubsidiaryId
LEFT JOIN t_company comp ON comp.Id = sub.companyId
WHERE 
pe.EmpId = ${filter.employeeId}
AND 
pe.MonthId = ${filter.monthId}`;

  const salaryDataQuery = `SELECT 
    y.employeeCode AS EmployeeCode, 
    CONCAT(y.firstName, ' ', IFNULL(y.middleName, ''), ' ', IFNULL(y.lastName, '')) AS EmployeeName,
    z.shortFormat AS MonthName, 
    TransactionType, 
    CASE 
        WHEN TransactionType = 'Earning' THEN (SELECT e.earningName FROM t_employee_earning e WHERE x.earning_deduction_id = e.Id)
        WHEN TransactionType = 'Deduction' THEN (SELECT e.DeductionName FROM t_employee_deduction e WHERE x.earning_deduction_id = e.Id)
        WHEN TransactionType = 'LoanType' THEN (SELECT e.Name FROM t_loan_type_setup e WHERE x.earning_deduction_id = e.Id)
        ELSE ''
    END AS EarningName, 
    Amount_Actual 
FROM t_payrollearningdeduction X
INNER JOIN t_employee_profile y ON x.EmpId = y.Id
INNER JOIN t_payroll_month_setup z ON x.SubsidiaryId = z.subsidiaryId 
WHERE
y.Id = ${filter.employeeId}
AND
x.MonthId = ${filter.monthId}
AND x.Amount_Actual > 0`;

  const loanQuery = `SELECT ls.name, OutstandingInstallment, OutStandingBalance FROM t_payroll_loandetail ld
LEFT JOIN t_loan_type_setup ls ON ls.Id = ld.LoanTypeId
WHERE
ld.EmpId = ${filter.employeeId}
AND
ld.MonthId = ${filter.monthId}`

  const [employeeData] = await sequelize.query(employeeDataQuery, {
    type: Sequelize.QueryTypes.RAW
  })

  if (!employeeData.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot generate Payslip');
  }

  const [salaryData] = await sequelize.query(salaryDataQuery, {
    type: Sequelize.QueryTypes.RAW
  })

  const [loanDetailData] = await sequelize.query(loanQuery, {
    type: Sequelize.QueryTypes.RAW
  })

  const loanData = [];
  const earningData = [];
  const deductionData = [];
  let deductionAmount = 0;
  let earningAmount = 0;

  salaryData.forEach(element => {
    if (element.TransactionType == 'Earning') {
      earningData.push(element);
      earningAmount += Number(element.Amount_Actual)
    }
    else if (element.TransactionType == 'Deduction') {
      deductionData.push(element);
      deductionAmount += Number(element.Amount_Actual)
    }
    else if (element.TransactionType == 'LoanType') {
      loanData.push(element);
      deductionAmount += Number(element.Amount_Actual)
    }
  });

  const data = {
    employeeData: employeeData[0],
    earningData: earningData,
    deductionData: deductionData,
    loanData: loanData,
    totalDeductionAmount: deductionAmount,
    totalEarningAmount: earningAmount,
    earningDeductionDifference: Number(earningAmount) - Number(deductionAmount),
    earningDeductionDifferenceInWords: digitsToWords(Number(earningAmount) - Number(deductionAmount)),
    loanDetailData: loanDetailData
  }

  const pdfStream = await generatePdf('payslip.hbs', data);

  return pdfStream
};

module.exports = {
  getAllRegisteredPayroll,
  generatePaySlip
};

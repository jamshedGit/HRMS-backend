const { EmployeeProfileModel, SubsidiaryModel, DeptModel, FormModel } = require("../../../models/index");
const Sequelize = require('sequelize');
const { paginationFacts, handleNestedData, formatDates } = require("../../../utils/common");
const pick = require("../../../utils/pick");

const ApiError = require("../../../utils/ApiError");
const httpStatus = require("http-status");
const { generatePdf } = require("../../../utils/pdf");
const { include } = require("underscore");

const Op = Sequelize.Op;

//Attributes required for employee  Table view
const employeeAttributes = [
  'Id',
  'employeeCode',
  'subsidiaryId',
  'gradeId',
  'designationId',
  'departmentId',
  'reportTo',
  'locationId','dateOfJoining','dateOfConfirmation',
  [
    Sequelize.literal(`CONCAT(t_employee_profile.firstName, ' ', COALESCE(t_employee_profile.middleName, ''), ' ', t_employee_profile.lastName)`),
    'fullName',  // Alias for the concatenated name
  ],
  'isActive',
]

/**
 * 
 * Get All employee  with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllRegisteredEmployees = async (req) => {
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
  if (filter.employeeId) employeeFilter.Id = filter.employeeId;


  //If no filter is present then send back response with no data
  if (!Object.keys(employeeFilter).length) {
    return paginationFacts(0, limit, options.pageNumber, []);
  }


  //Get data according to filters
  const { count, rows } = await EmployeeProfileModel.findAndCountAll({
    order: [
      ['firstName', 'ASC']
    ],
    where: {
      ...employeeFilter,
      isActive: true
    },
    offset: offset,
    limit: limit,
    attributes: employeeAttributes,
    include: [
      {
        model: DeptModel,
        attributes: ['deptId', 'deptName'], // Specify the parent attribute you want
        as: 'department', // This should match the alias if defined in associations


      },
      {
        model: FormModel,
        attributes: ['Id', 'formName'], // Specify the parent attribute you want
        as: 'designation', // This should match the alias if defined in associations


      },
      {
        model: FormModel,
        attributes: ['Id', 'formName'], // Specify the parent attribute you want
        as: 'grade', // This should match the alias if defined in associations


      },

      {
        model: FormModel,
        attributes: ['Id', 'formName'], // Specify the parent attribute you want
        as: 'employeeType', // This should match the alias if defined in associations


      },
      {
        model: EmployeeProfileModel,
        attributes: [
          'Id',
          [
            Sequelize.literal(`CONCAT(ReportTo.firstName, ' ', COALESCE(ReportTo.middleName, ''), ' ', ReportTo.lastName)`),
            'reportName',  // Alias for the concatenated name
          ],
        ],
        as: 'ReportTo', // Self-join alias
        required: false, // Allow employees without a ReportTo
      },
      
    ]
  });

  //Handle nested data that comes with include
  const updatedRows = handleNestedData(rows)

  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};

/**
 * 
 * Get All Employee  with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllRegisteredEmployeesForPdf = async (req) => {
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
  if (filter.employeeId) employeeFilter.Id = filter.employeeId;



  //If no filter is present then send back response with no data
  if (!Object.keys(employeeFilter).length) {
    throw new ApiError(httpStatus.BAD_REQUEST);
  }

  //Get data according to filters

  const rows = await EmployeeProfileModel.findAll({
    order: [
      ['firstName', 'ASC']
    ],
    where: {
      ...employeeFilter,
      isActive: true
    },
    attributes: employeeAttributes,
    include: [
      {
        model: DeptModel,
        attributes: ['deptId', 'deptName'], // Specify the parent attribute you want
        as: 'department', // This should match the alias if defined in associations


      },
      {
        model: FormModel,
        attributes: ['Id', 'formName'], // Specify the parent attribute you want
        as: 'designation', // This should match the alias if defined in associations


      },
      {
        model: FormModel,
        attributes: ['Id', 'formName'], // Specify the parent attribute you want
        as: 'grade', // This should match the alias if defined in associations


      },

      {
        model: FormModel,
        attributes: ['Id', 'formName'], // Specify the parent attribute you want
        as: 'employeeType', // This should match the alias if defined in associations


      },
      {
        model: EmployeeProfileModel,
        attributes: [
          'Id',
          [
            Sequelize.literal(`CONCAT(ReportTo.firstName, ' ', COALESCE(ReportTo.middleName, ''), ' ', ReportTo.lastName)`),
            'reportName',  // Alias for the concatenated name
          ],
        ],
        as: 'ReportTo', // Self-join alias
        required: false, // Allow employees without a ReportTo
      },
      
    ]

  });

  //Handle nested data that comes with include
  const updatedRows = handleNestedData(rows)

  const data = {
    filters: { ...labels },
    employees: updatedRows,
    currentDate: formatDates(new Date(), 'dd/MMM/yyyy HH:ss'),
  }

  const pdfStream = await generatePdf('employee_register.hbs', data);

  return pdfStream
};

module.exports = {
  getAllRegisteredEmployees,
  getAllRegisteredEmployeesForPdf
};

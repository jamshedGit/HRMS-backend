const { EmployeeProfileModel, SubsidiaryModel, DeptModel, FormModel } = require("../../../models/index");
const Sequelize = require('sequelize');
const { paginationFacts, handleNestedData, formatDates } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { startOfDay, endOfDay } = require("date-fns");
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
  'locationId','dateOfJoining','dateOfConfirmation','dateOfBirth',
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


//   //date of Joining
//   let dateOfJoiningFilter = {}; // Initialize this as an empty object

//   // Handle the Date of Joining filter (dojFrom and dojTo)
//   if (filter.dojFrom || filter.dojTo) {
//     if (filter.dojFrom && filter.dojTo) {
//       // Both from and to date are provided
//       const startOfJoiningDate = startOfDay(new Date(filter.dojFrom));
//       const endOfJoiningDate = endOfDay(new Date(filter.dojTo));
  
//       dateOfJoiningFilter.dateOfJoining = {
//         [Op.between]: [startOfJoiningDate, endOfJoiningDate], // Ensure an array with two Date objects
//       };
//     } else if (filter.dojFrom) {
//       // Only dojFrom is provided
//       const startOfJoiningDate = startOfDay(new Date(filter.dojFrom));
//       dateOfJoiningFilter.dateOfJoining = {
//         [Op.gte]: startOfJoiningDate,
//       };
//     } else if (filter.dojTo) {
//       // Only dojTo is provided
//       const endOfJoiningDate = endOfDay(new Date(filter.dojTo));
//       dateOfJoiningFilter.dateOfJoining = {
//         [Op.lte]: endOfJoiningDate,
//       };
//     }
//   }

// // If the date filter exists, merge it with the employeeFilter
// if (Object.keys(dateOfJoiningFilter).length) {
//   employeeFilter.dateOfJoining = dateOfJoiningFilter.dateOfJoining;
// }


//   //date of Confirmation

// let dateOfConfirmationFilter = {}; // Initialize this as an empty object


// if (filter.docFrom || filter.docTo) {
//   if (filter.docFrom && filter.docTo) {
//     // Both from and to date are provided
//     const startOfConfirmationDate = startOfDay(new Date(filter.docFrom));
//     const endOfConfirmationDate = endOfDay(new Date(filter.docTo));

//     dateOfConfirmationFilter.dateOfConfirmation = {
//       [Op.between]: [startOfConfirmationDate, endOfConfirmationDate], // Ensure an array with two Date objects
//     };
//   } else if (filter.docFrom) {
//     // Only dojFrom is provided
//     const startOfConfirmationDate = startOfDay(new Date(filter.docFrom));
//     dateOfConfirmationFilter.dateOfConfirmation = {
//       [Op.gte]: startOfConfirmationDate,
//     };
//   } else if (filter.docTo) {
//     // Only dojTo is provided
//     const endOfConfirmationDate = endOfDay(new Date(filter.docTo));
//     dateOfConfirmationFilter.dateOfConfirmation = {
//       [Op.lte]: endOfConfirmationDate,
//     };
//   }
// }

// // If the date filter exists, merge it with the employeeFilter
// if (Object.keys(dateOfConfirmationFilter).length) {
// employeeFilter.dateOfConfirmation = dateOfConfirmationFilter.dateOfConfirmation;
// }

//common filter for date filters
const  getDateFilter=(fromDate, toDate, dateField) =>{
  let dateFilter = {}; // Initialize as an empty object

  if (fromDate || toDate) {
    if (fromDate && toDate) {
      // Both from and to date are provided
      const startDate = startOfDay(new Date(fromDate));
      const endDate = endOfDay(new Date(toDate));

      dateFilter[dateField] = {
        [Op.between]: [startDate, endDate],
      };
    } else if (fromDate) {
      // Only from date is provided
      const startDate = startOfDay(new Date(fromDate));
      dateFilter[dateField] = {
        [Op.gte]: startDate,
      };
    } else if (toDate) {
      // Only to date is provided
      const endDate = endOfDay(new Date(toDate));
      dateFilter[dateField] = {
        [Op.lte]: endDate,
      };
    }
  }

  return dateFilter; // Return the constructed date filter
}

const dateOfJoiningFilter = getDateFilter(filter.dojFrom, filter.dojTo, "dateOfJoining");
const dateOfConfirmationFilter = getDateFilter(filter.docFrom, filter.docTo, "dateOfConfirmation");
const dateOfBirthFilter = getDateFilter(filter.dobFrom, filter.dobTo, "dateOfBirth");
// If the date filter exists, merge it with the employeeFilter
if (Object.keys(dateOfJoiningFilter).length) {
  employeeFilter.dateOfJoining = dateOfJoiningFilter.dateOfJoining;
}

if (Object.keys(dateOfConfirmationFilter).length) {
  employeeFilter.dateOfConfirmation = dateOfConfirmationFilter.dateOfConfirmation;
}

if (Object.keys(dateOfBirthFilter).length) {
  employeeFilter.dateOfBirth = dateOfBirthFilter.dateOfBirth;
}



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
        attributes: [ 'formName'], // Specify the parent attribute you want
        as: 'designation', // This should match the alias if defined in associations


      },
      {
        model: FormModel,
        attributes: [ 'formName'], // Specify the parent attribute you want
        as: 'grade', // This should match the alias if defined in associations


      },

      {
        model: FormModel,
        attributes: [ 'formName'], // Specify the parent attribute you want
        as: 'employeeType', // This should match the alias if defined in associations


      },
      {
        model: EmployeeProfileModel,
        attributes: [
      
          [
            Sequelize.literal(`CONCAT(ReportTo.firstName, ' ', COALESCE(ReportTo.middleName, ''), ' ', ReportTo.lastName)`),
            'reportName',  // Alias for the concatenated name
          ],
        ],
        as: 'ReportTo', // Self-join alias
        required: false, // Allow employees without a ReportTo
      },

      {
        model: SubsidiaryModel,
        attributes: [ 'name'], // Specify the parent attribute you want
        as: 'subsidiary', // This should match the alias if defined in associations


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

  const pdfStream = await generatePdf('employee_register.hbs', data,{ landscape: true });

  return pdfStream
};

module.exports = {
  getAllRegisteredEmployees,
  getAllRegisteredEmployeesForPdf
};

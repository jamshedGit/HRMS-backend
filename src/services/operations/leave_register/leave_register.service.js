const { LeaveApplicationModel, EmployeeProfileModel, LeaveTypeModel, SubsidiaryModel } = require("../../../models/index");
const Sequelize = require('sequelize');
const { paginationFacts, handleNestedData, formatDates } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { startOfDay, endOfDay } = require("date-fns");
const ApiError = require("../../../utils/ApiError");
const httpStatus = require("http-status");
const { generatePdf } = require("../../../utils/pdf");

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
const getAllRegisteredLeaves = async (req) => {
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
    return paginationFacts(0, limit, options.pageNumber, []);
  }

  //Get data according to filters
  const { count, rows } = await LeaveApplicationModel.findAndCountAll({
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
      { model: LeaveTypeModel, attributes: ['name'] }
    ],
    attributes: leaveApplicationAttributes,
    offset: offset,
    limit: limit,
  });

  //Handle nested data that comes with include
  const updatedRows = handleNestedData(rows)

  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};

/**
 * 
 * Get All Leave Applications with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllRegisteredLeavesForPdf = async (req) => {
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

module.exports = {
  getAllRegisteredLeaves,
  getAllRegisteredLeavesForPdf
};

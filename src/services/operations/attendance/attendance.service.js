const httpStatus = require("http-status");
const { AttendanceModel, EmployeeProfileModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, addDaysInDate } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { startOfDay, endOfDay } = require("date-fns");

const Op = Sequelize.Op;

//Attributes required for Attendance Table view
const attendanceAttributes = [
  'subsidiaryId',
  'employeeId',
  'employeeCode',
  'comments',
  'attDate',
  'attDateIn',
  'attDateOut',
  'timeIn',
  'timeOut',
  'Id',
  'isActive',
]

/**
 * Create Attendance
 * 
 * @param {Object} req 
 * @returns 
 */
const createAttendance = async (req) => {
  const body = req.body;
  const oldRecord = await getattendanceData({ employeeId: body.employeeId, attDate: body.attDateIn, isActive: true })
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, 'Record Already Exists for this date')
  }
  const employeeData = await EmployeeProfileModel.findByPk(body.employeeId, { attributes: ['employeeCode', 'subsidiaryId'] });
  if (!employeeData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Employee Not Found')
  }
  const payload = {
    ...body,
    createdBy: req.user.id,
    subsidiaryId: employeeData.subsidiaryId,
    employeeCode: employeeData.employeeCode,
    attDate: body.attDateIn
  };
  const createdData = await AttendanceModel.create(payload);
  const data = await getAttendanceById(createdData.Id, attendanceAttributes)
  return data;
};


/**
 * 
 * Get All Attendances with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllattendance = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get search field value for filtering
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await AttendanceModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      isActive: true
    },
    attributes: attendanceAttributes,
    offset: offset,
    limit: limit,
  });

  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, rows);
};


/**
 * Get Single Attendance By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getAttendanceById = async (id, options = null) => {
  return AttendanceModel.findByPk(id, {
    attributes: options || attendanceAttributes,
  });
};

const getattendanceByFilters = async (req) => {
  const body = req.body;
  const startOfDayDate = startOfDay(new Date(body.attDateIn));
  const endOfDayDate = endOfDay(new Date(body.attDateIn));
  return await getattendanceData({
    employeeId: body.employeeId,
    attDateIn: {
      [Op.between]: [startOfDayDate, endOfDayDate],  // Filters between start and end of the day
    },
  }, attendanceAttributes) || { ...body, attDateOut: body.attDateIn }
}


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getattendanceData = async (filters, attributes = null, include = null) => {
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

  return await AttendanceModel.findOne(options);
};


/**
 * Update Single Attendance By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateAttendanceById = async (body, updatedBy) => {
  const oldRecordWithId = await getattendanceData({ employeeId: body.employeeId, attDate: body.attDateIn, isActive: true, Id: { [Op.ne]: body.Id } });
  if (oldRecordWithId) {
    throw new ApiError(httpStatus.CONFLICT, 'Record already exists for this Date')
  }
  const oldRecord = await getattendanceData({ Id: body.Id })
  body.updatedBy = updatedBy;
  body.attDate = body.attDateIn
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save({ fields: ['comments', 'attDate', 'attDateIn', 'attDateOut', 'timeIn', 'timeOut'] });
  const data = await getAttendanceById(updatedData.Id, attendanceAttributes)
  return data;
};

/**
 * Delete Single Attendance Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteAttendanceById = async (id) => {
  const oldRecord = await getattendanceData({ Id: id, isActive: true });
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  Object.assign(oldRecord, { isActive: false });
  await oldRecord.save({ fields: ['isActive'] });
  return oldRecord;
};

module.exports = {
  getAllattendance,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
  createAttendance,
  getattendanceByFilters
};

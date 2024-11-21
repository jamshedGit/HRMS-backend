const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { AttendanceServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Attendance
 * 
 * @param {Object} req 
 * @returns res
 */
const createattendance = catchAsync(async (req, res) => {
  const data = await AttendanceServicePage.createAttendance(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * Update Single Attendance By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateattendance = catchAsync(async (req, res) => {
  const data = await AttendanceServicePage.updateAttendanceById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});


/**
 * Get Single Attendance By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getattendanceById = catchAsync(async (req, res) => {
  const data = await AttendanceServicePage.getAttendanceById(req.params.id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * Get Single Attendance By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getattendanceByFilters = catchAsync(async (req, res) => {
  const data = await AttendanceServicePage.getattendanceByFilters(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * 
 * Get All Attendance with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllattendance = catchAsync(async (req, res) => {
  const data = await AttendanceServicePage.getAllattendance(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * Delete Single Attendance Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteattendance = catchAsync(async (req, res) => {
  const data = await AttendanceServicePage.deleteAttendanceById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

module.exports = {
  createattendance,
  getattendanceById,
  getattendanceByFilters,
  updateattendance,
  getAllattendance,
  deleteattendance
};

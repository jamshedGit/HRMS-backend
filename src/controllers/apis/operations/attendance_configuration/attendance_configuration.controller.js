const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { attendance_configuration } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");
const { Attendance_ConfigurationModel } = require("../../../../models");


/**
 * Create Leave Type
 * 
 * @param {Object} req 
 * @returns res
 */
const createAttendanceConfiguration = catchAsync(async (req, res) => {
  try {
    const createdAttendanceConfiguration = await attendance_configuration.createAttendanceConfiguration(req);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: createdAttendanceConfiguration,
    });
  }
  catch (error) {

    if (error.parent.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
});

/**
 * Update Single Leave Type By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateAttendanceConfiguration = catchAsync(async (req, res) => {
  console.log("fds", req.body)
  const updatedAttendanceConfigurationData = await attendance_configuration.updateAttendanceConfigurationById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: updatedAttendanceConfigurationData,
  });
});


/**
 * Get Single Leave Type By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getAttendanceConfigurationById = catchAsync(async (req, res) => {
  const AttendanceConfigurationData = await attendance_configuration.getAttendanceConfigurationById(req.params.id);
  if (!AttendanceConfigurationData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: AttendanceConfigurationData,
  });
});

/**
 * 
 * Get All Leave Type with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllAttendanceConfiguration = catchAsync(async (req, res) => {
  const result = await attendance_configuration.queryAttendanceConfigurations(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result
  });
});

/**
 * Delete Single Leave Type Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteAttendanceConfiguration = catchAsync(async (req, res) => {
  const AttendanceConfigurationData = await attendance_configuration.deleteAttendanceConfigurationById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: AttendanceConfigurationData,
  });
});

const getAttendanceConfigurationDropdownData = catchAsync(async (req, res) => {
  const dropdownData = await AttendanceConfigurationServicePage.getDropdownData();
  if (!dropdownData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: dropdownData,
  });
});

module.exports = {
  createAttendanceConfiguration,
  getAttendanceConfigurationById,
  updateAttendanceConfiguration,
  getAllAttendanceConfiguration,
  deleteAttendanceConfiguration,
  getAttendanceConfigurationDropdownData
};

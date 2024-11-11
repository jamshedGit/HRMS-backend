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
const createEmployeeShift = catchAsync(async (req, res) => {
  try {
    const createdEmployeeShift = await attendance_configuration.createEmployeeShift(req);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: createdEmployeeShift,
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
const updateEmployeeShift = catchAsync(async (req, res) => {
  console.log("fds", req.body)
  const updatedEmployeeShiftData = await attendance_configuration.updateEmployeeShiftById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: updatedEmployeeShiftData,
  });
});


/**
 * Get Single Leave Type By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getEmployeeShiftById = catchAsync(async (req, res) => {
  const EmployeeShiftData = await attendance_configuration.getEmployeeShiftById(req.params.id);
  if (!EmployeeShiftData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: EmployeeShiftData,
  });
});

/**
 * 
 * Get All Leave Type with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllEmployeeShift = catchAsync(async (req, res) => {
  const result = await attendance_configuration.queryEmployeeShifts(req);
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
const deleteEmployeeShift = catchAsync(async (req, res) => {
  const EmployeeShiftData = await attendance_configuration.deleteEmployeeShiftById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: EmployeeShiftData,
  });
});

const getEmployeeShiftDropdownData = catchAsync(async (req, res) => {
  const dropdownData = await EmployeeShiftServicePage.getDropdownData();
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
  createEmployeeShift,
  getEmployeeShiftById,
  updateEmployeeShift,
  getAllEmployeeShift,
  deleteEmployeeShift,
  getEmployeeShiftDropdownData
};

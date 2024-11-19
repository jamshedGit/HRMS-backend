const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { employee_shift } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");
const { Employee_ShiftModel } = require("../../../../models");


/**
 * Create Leave Type
 * 
 * @param {Object} req 
 * @returns res
 */
const createEmployeeShift = catchAsync(async (req, res) => {
  try {
    const createdEmployeeShift = await employee_shift.createEmployeeShift(req);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: createdEmployeeShift,
    });
  }
  catch (error) {
      throw error;
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
  
  const updatedEmployeeShiftData = await employee_shift.updateEmployeeShiftById(req.body, req.user.Id);
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
  
  const EmployeeShiftData = await employee_shift.getEmployeeShiftById(req.params.id);
  
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
  
  const result = await employee_shift.queryEmployeeShifts(req);
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
  const EmployeeShiftData = await employee_shift.deleteEmployeeShiftById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: EmployeeShiftData,
  });
});



module.exports = {
  createEmployeeShift,
  getEmployeeShiftById,
  updateEmployeeShift,
  getAllEmployeeShift,
  deleteEmployeeShift
  
};

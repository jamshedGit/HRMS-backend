const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { LeaveTypeServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Leave Type
 * 
 * @param {Object} req 
 * @returns res
 */
const createLeaveType = catchAsync(async (req, res) => {
  const createdLeaveType = await LeaveTypeServicePage.createLeaveType(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: createdLeaveType,
  });
});

/**
 * Update Single Leave Type By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateLeaveType = catchAsync(async (req, res) => {
  const updatedLeaveTypeData = await LeaveTypeServicePage.updateLeaveTypeById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: updatedLeaveTypeData,
  });
});


/**
 * Get Single Leave Type By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getLeaveTypeById = catchAsync(async (req, res) => {
  const leaveTypeData = await LeaveTypeServicePage.getLeaveTypeById(req.params.id);
  if (!leaveTypeData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: leaveTypeData,
  });
});

/**
 * 
 * Get All Leave Type with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllLeaveType = catchAsync(async (req, res) => {
  const result = await LeaveTypeServicePage.getAllLeaveType(req);
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
const deleteLeaveType = catchAsync(async (req, res) => {
  const leaveTypeData = await LeaveTypeServicePage.deleteLeaveTypeById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: leaveTypeData,
  });
});


/**
 * Get Single Leave Type By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getPaymentMode = catchAsync(async (req, res) => {
  const paymentData = await LeaveTypeServicePage.getPaymentModes(req.params.id);
  if (!paymentData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: paymentData,
  });
});


module.exports = {
  createLeaveType,
  getLeaveTypeById,
  updateLeaveType,
  getAllLeaveType,
  deleteLeaveType,
  getPaymentMode
};

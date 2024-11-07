const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { LeaveEncashmentServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Leave Encashment
 * 
 * @param {Object} req 
 * @returns res
 */
const createLeaveEncashment = catchAsync(async (req, res) => {
  const data = await LeaveEncashmentServicePage.createleaveEncashment(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * Get Single Leave Encashment By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getLeaveEncashmentById = catchAsync(async (req, res) => {
  const data = await LeaveEncashmentServicePage.getleaveEncashmentById(req.params.id);
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
 * 
 * Get All Leave Encashment with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllLeaveEncashment = catchAsync(async (req, res) => {
  const data = await LeaveEncashmentServicePage.getAllleaveEncashment(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * Delete Single Leave Encashment Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteLeaveEncashment = catchAsync(async (req, res) => {
  const data = await LeaveEncashmentServicePage.deleteleaveEncashmentById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

module.exports = {
  createLeaveEncashment,
  getLeaveEncashmentById,
  getAllLeaveEncashment,
  deleteLeaveEncashment
};

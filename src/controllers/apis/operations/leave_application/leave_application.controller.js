const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { LeaveApplicationServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Leave Application
 * 
 * @param {Object} req 
 * @returns res
 */
const createleaveApplication = catchAsync(async (req, res) => {
  const data = await LeaveApplicationServicePage.createleaveApplication(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * Update Single Leave Application By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateleaveApplication = catchAsync(async (req, res) => {
  const data = await LeaveApplicationServicePage.updateleaveApplicationById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});


/**
 * Get Single Leave Application By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getleaveApplicationById = catchAsync(async (req, res) => {
  const data = await LeaveApplicationServicePage.getleaveApplicationById(req.params.id);
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
 * Get All Leave Application with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllleaveApplication = catchAsync(async (req, res) => {
  const data = await LeaveApplicationServicePage.getAllleaveApplication(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * Delete Single Leave Application Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteleaveApplication = catchAsync(async (req, res) => {
  const data = await LeaveApplicationServicePage.deleteleaveApplicationById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

module.exports = {
  createleaveApplication,
  getleaveApplicationById,
  updateleaveApplication,
  getAllleaveApplication,
  deleteleaveApplication
};

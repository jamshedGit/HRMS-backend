const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { SalaryRoundingPolicyServicePage, settingService } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Rounding Policy
 * 
 * @param {Object} req 
 * @returns res
 */
const createRoundingPolicy = catchAsync(async (req, res) => {
  const createdRoundingPolicy = await SalaryRoundingPolicyServicePage.createRoundingPolicy(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: createdRoundingPolicy,
  });
});

/**
 * Update Single Rounding By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateRoundingPolicy = catchAsync(async (req, res) => {
  const updatedRoundingData = await SalaryRoundingPolicyServicePage.updateRoundingPolicyById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: updatedRoundingData,
  });
});


/**
 * Get Single Rounding By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getAllRoundingPolicyById = catchAsync(async (req, res) => {
  const roundingData = await SalaryRoundingPolicyServicePage.getRoundingPolicyById(req.params.id);
  if (!roundingData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: roundingData,
  });
});

/**
 * 
 * Get All Rounding Policies with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllRoundingPolicies = catchAsync(async (req, res) => {
  const result = await SalaryRoundingPolicyServicePage.getAllRoundingPolicies(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result
  });
});

/**
 * Delete Single Rounding Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteRoundingPolicy = catchAsync(async (req, res) => {
  const roundingData = await SalaryRoundingPolicyServicePage.deleteRoundingPolicyById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: roundingData,
  });
});


/**
 * Get Single Rounding By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getPaymentMode = catchAsync(async (req, res) => {
  const paymentData = await SalaryRoundingPolicyServicePage.getPaymentModes(req.params.id);
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
  getAllRoundingPolicyById,
  createRoundingPolicy,
  updateRoundingPolicy,
  getAllRoundingPolicies,
  deleteRoundingPolicy,
  getPaymentMode
};

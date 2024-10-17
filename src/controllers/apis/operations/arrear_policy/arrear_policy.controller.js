const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { ArrearPolicyServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Arrear Policy
 * 
 * @param {Object} req 
 * @returns res
 */
const createArrearPolicy = catchAsync(async (req, res) => {
  const createdArrearPolicy = await ArrearPolicyServicePage.createArrearPolicy(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: createdArrearPolicy,
  });
});

/**
 * 
 * Get All Arrear Policies with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllArrearPolicies = catchAsync(async (req, res) => {
  const result = await ArrearPolicyServicePage.getAllArrearPolicies(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result
  });
});

/**
 * Get Single Arear By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getArrearById = catchAsync(async (req, res) => {
  const arrearData = await ArrearPolicyServicePage.getArrearById(req.params.id);
  if (!arrearData) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Data found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: arrearData,
  });
});

/**
 * Update Single Arrear By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateArrearPolicy = catchAsync(async (req, res) => {
  const updatedArrearData = await ArrearPolicyServicePage.updateArrearById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: updatedArrearData,
  });
});

/**
 * Delete Single Arrear Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteArrear = catchAsync(async (req, res) => {
  const arrearData = await ArrearPolicyServicePage.deleteArrearById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: arrearData,
  });
});


/**
 * Get Active Payroll Month For View
 * 
 * @param {Number} id 
 * @returns res
 */
const getActivePayrollMonth = catchAsync(async (req, res) => {
  const payrollData = await ArrearPolicyServicePage.getActivePayrollMonth();
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: payrollData || {},
  });
});


module.exports = {
  getAllArrearPolicies,
  getArrearById,
  createArrearPolicy,
  updateArrearPolicy,
  deleteArrear,
  getActivePayrollMonth
};

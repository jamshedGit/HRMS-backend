const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { allocateLeavesServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Allocate Leaves
 * 
 * @param {Object} req 
 * @returns res
 */
const createallocateLeaves = catchAsync(async (req, res) => {
  const data = await allocateLeavesServicePage.createallocateLeaves(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * 
 * Get All Allocate Leaves
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllAllocateLeaves = catchAsync(async (req, res) => {
  const data = await allocateLeavesServicePage.getAllAllocateLeaves(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * 
 * Get Dropdown data for policy
 * 
 * @param {Object} req 
 * @returns res
 */
const getPolicyTypeDropdown = catchAsync(async (req, res) => {
  const data = await allocateLeavesServicePage.getDropdownData();
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

module.exports = {
  createallocateLeaves,
  getAllAllocateLeaves,
  getPolicyTypeDropdown
};

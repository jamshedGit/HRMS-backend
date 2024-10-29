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
 * Update Single Allocate Leaves By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateallocateLeaves = catchAsync(async (req, res) => {
  const data = await allocateLeavesServicePage.updateallocateLeavesById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});


/**
 * Get Single Allocate Leaves By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getallocateLeavesById = catchAsync(async (req, res) => {
  const data = await allocateLeavesServicePage.getallocateLeavesById(req.params.id);
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
 * Get All Allocate Leaves with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllallocateLeaves = catchAsync(async (req, res) => {
  const data = await allocateLeavesServicePage.getAllAllocateLeaves(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * Delete Single Allocate Leaves Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteallocateLeaves = catchAsync(async (req, res) => {
  const data = await allocateLeavesServicePage.deleteallocateLeavesById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
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
  getallocateLeavesById,
  updateallocateLeaves,
  getAllallocateLeaves,
  deleteallocateLeaves,
  getPolicyTypeDropdown
};

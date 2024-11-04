const catchAsync = require("../../../../utils/catchAsync");
const { employeeLeaveBalanceServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Employee Leave Balance
 * 
 * @param {Object} req 
 * @returns res
 */
const createLeaveBalance = catchAsync(async (req, res) => {
  const data = await employeeLeaveBalanceServicePage.createLeaveBalance(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * 
 * Get All Employee Leave Balance with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllLeaveBalances = catchAsync(async (req, res) => {
  const data = await employeeLeaveBalanceServicePage.getAllLeaveBalance(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * Get Employee Leave Balance By Filters
 * 
 * @param {Number} id 
 * @returns res
 */
const getLeaveBalanceByFilters = catchAsync(async (req, res) => {
  const data = await employeeLeaveBalanceServicePage.getLeaveBalanceByFilters(req.body);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * Update Single Employee Leave Balance By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateLeaveBalance = catchAsync(async (req, res) => {
  const data = await employeeLeaveBalanceServicePage.updateLeaveBalance(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

module.exports = {
  getAllLeaveBalances,
  getLeaveBalanceByFilters,
  createLeaveBalance,
  updateLeaveBalance,
};

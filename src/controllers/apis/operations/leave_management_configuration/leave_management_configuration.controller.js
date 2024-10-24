const catchAsync = require("../../../../utils/catchAsync");
const { LeaveManagementConfigurationService } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Leave Management Configuration
 * 
 * @param {Object} req 
 * @returns res
 */
const createleaveManagementConfiguration = catchAsync(async (req, res) => {
  const createdleaveManagementConfiguration = await LeaveManagementConfigurationService.createleaveManagementConfiguration(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: createdleaveManagementConfiguration,
  });
});

/**
 * Update Single Leave Management Configuration By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateleaveManagementConfiguration = catchAsync(async (req, res) => {
  const updatedleaveManagementConfigurationData = await LeaveManagementConfigurationService.updateleaveManagementConfigurationById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: updatedleaveManagementConfigurationData,
  });
});


/**
 * Get Single Leave Management Configuration By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getleaveManagementConfigurationById = catchAsync(async (req, res) => {
  const leaveManagementConfigurationData = await LeaveManagementConfigurationService.getleaveManagementConfigurationByForEdit(req.body);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: leaveManagementConfigurationData,
  });
});

/**
 * 
 * Get All Leave Management Configuration with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllleaveManagementConfiguration = catchAsync(async (req, res) => {
  const result = await LeaveManagementConfigurationService.getAllleaveManagementConfiguration(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result
  });
});

/**
 * Delete Single Leave Management Configuration Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteleaveManagementConfiguration = catchAsync(async (req, res) => {
  const leaveManagementConfigurationData = await LeaveManagementConfigurationService.deleteleaveManagementConfigurationById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: leaveManagementConfigurationData,
  });
});

/**
 * Delete Single Leave Management Configuration Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteLeaveTypePolicy = catchAsync(async (req, res) => {
  const leaveManagementConfigurationData = await LeaveManagementConfigurationService.deleteLeaveTypePolicy(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: leaveManagementConfigurationData,
  });
});

/**
 * Delete Single Leave Management Configuration Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteLeaveTypeSalaryDeduction = catchAsync(async (req, res) => {
  const leaveManagementConfigurationData = await LeaveManagementConfigurationService.deleteLeaveTypeDeductionPolicy(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: leaveManagementConfigurationData,
  });
});

module.exports = {
  createleaveManagementConfiguration,
  getleaveManagementConfigurationById,
  updateleaveManagementConfiguration,
  getAllleaveManagementConfiguration,
  deleteleaveManagementConfiguration,
  deleteLeaveTypePolicy,
  deleteLeaveTypeSalaryDeduction
};

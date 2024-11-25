const httpStatus = require("http-status");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { EmployeeRosterServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");


/**
 * Create Employee Roster
 * 
 * @param {Object} req 
 * @returns res
 */
const createemployeeRoster = catchAsync(async (req, res) => {
  const data = await EmployeeRosterServicePage.createEmployeeRoster(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

/**
 * Update Single Employee Roster By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns res
 */
const updateemployeeRoster = catchAsync(async (req, res) => {
  const data = await EmployeeRosterServicePage.updateEmployeeRosterById(req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});


/**
 * Get Single Employee Roster By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const getemployeeRosterById = catchAsync(async (req, res) => {
  const data = await EmployeeRosterServicePage.getEmployeeRosterById(req.params.id);
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
 * Get All Employee Roster with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllemployeeRoster = catchAsync(async (req, res) => {
  const data = await EmployeeRosterServicePage.getAllEmployeeRoster(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * Delete Single Employee Roster Record By Id
 * 
 * @param {Number} id 
 * @returns res
 */
const deleteemployeeRoster = catchAsync(async (req, res) => {
  const data = await EmployeeRosterServicePage.deleteEmployeeRosterById(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

module.exports = {
  createemployeeRoster,
  getemployeeRosterById,
  updateemployeeRoster,
  getAllemployeeRoster,
  deleteemployeeRoster
};

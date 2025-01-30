const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { settingService } = require('../../../services');
const { HttpStatusCodes, HttpResponseMessages } = require('../../../utils/constants');
const GeoPoint = require('geopoint');


const getRolesMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getRolesMasterData(req.user.roleId,req.user.Id),
  });
});

const getResourcesMasterData = catchAsync(async (req, res) => {
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: await settingService.getResourcesMasterData(),
    });
});

const getCountriesMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getCountriesMasterData(),
  });
});

const getBanksMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getBanksMasterData(),
  });
});

const get_Bank_Branch_MasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.get_Bank_Branch_MasterData(),
  });
});


const getEmployeesMasterData = catchAsync(async (req, res) => {

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getEmployeesMasterData(req),
  });
});

const getEmployeesMasterDataBySubsidiary = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getEmployeesMasterDataBySubsidiary(req.body.subsidiaryId),
  });
});


const getDeptMasterData = catchAsync(async (req, res) => {

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getDeptMasterData(req,req?.body?.Id),
  });
});

const getChildsMenusByParentId = catchAsync(async (req, res) => {
  
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getChildMenusByParentId(req.parentFormId),
  });
});

const getFormMenusMasterData = catchAsync(async (req, res) => {

  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getFormMenusMasterData(req),
  });
});

const getAllLeaveType = catchAsync(async (req, res) => {
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getLeaveTypesData(req.body.employeeId),
  });
});

const getAllLeaveTypeBySubsidiary = catchAsync(async (req, res) => {
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getLeaveTypesDataBySubsidiary(req.body.subsidiaryId),
  });
});

const getAllEmployeeShift = catchAsync(async (req, res) => {
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getAllEmployeeShift(req),
  });
});

const getEncashmentLeaveType = catchAsync(async (req, res) => {
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getEncashmentLeaveTypeData(req.body.employeeId, req.body.yearId),
  });
});

const getAllSubsidiaries = catchAsync(async (req, res) => {
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getAllSubsidiaryData(req),
  });
});

const getAllFiscalYears = catchAsync(async (req, res) => {
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getAllFiscalYearData(req.body.employeeId),
  });
});

const getCurrentFiscalYears = catchAsync(async (req, res) => {
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getActiveFiscalYearData(req.body.subsidiaryId),
  });
});


const getCitiesMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getCitiesMasterData(req.body.countryId),
  });
});

const getStatusMasterData = catchAsync(async (req, res) => {
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: await settingService.getStatusMasterData(req.body),
    });
});


const getRevisionHistoryByEmpId = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getRevisionHistoryByEmpId(req.body.employeeId),
  });
});

const GetLastInserted_ID_ByTableName = catchAsync(async (req, res) => {

  const Receipt = await settingService.GetLastInserted_ID_ByTableName(req.body.tableName,req.body.pkIdColumn,req.body.whereClause);

  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


const getCompanyMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getCompanyMasterData(req),
  });
});

const getEmployeesNoNeedPermission= catchAsync(async (req, res) => {

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getEmployeesNoNeedPermission(),
  });
});


module.exports = {
  getRolesMasterData,
  getResourcesMasterData,
  getCountriesMasterData,
  getCitiesMasterData,
  getStatusMasterData,
  getBanksMasterData,
  getDeptMasterData,
  getFormMenusMasterData,
  getChildsMenusByParentId,
  getEmployeesMasterData,
  GetLastInserted_ID_ByTableName,
  get_Bank_Branch_MasterData,
  getRevisionHistoryByEmpId,
  getAllLeaveType,
  getAllSubsidiaries,
  getAllFiscalYears,
  getEncashmentLeaveType,
  getAllEmployeeShift,
  getAllLeaveTypeBySubsidiary,
  getCurrentFiscalYears,
  getEmployeesMasterDataBySubsidiary,
  getCompanyMasterData,getEmployeesNoNeedPermission,
};

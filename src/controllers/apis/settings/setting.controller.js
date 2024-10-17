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
    data: await settingService.getRolesMasterData(req.user.roleId),
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
    data: await settingService.getEmployeesMasterData(),
  });
});


const getDeptMasterData = catchAsync(async (req, res) => {
  
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getDeptMasterData(),
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
  console.log("parentId main:", req.body);
  res.send({  
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getFormMenusMasterData(req),
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
  console.log("GetLastInserted_ID_ByTableName")
  console.log(req.body)
  const Receipt = await settingService.GetLastInserted_ID_ByTableName(req.body.tableName,req.body.prefix);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
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
  getRevisionHistoryByEmpId
};

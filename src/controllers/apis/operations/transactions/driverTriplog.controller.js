const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { driverTriplogService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createDriverTriplog = catchAsync(async (req, res) => {
  console.log("reqested User", req.body);
  const driverTriplog = await driverTriplogService.createDriverTripLog(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: driverTriplog,
  });
});

const getDriverTriplogs = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const result = await driverTriplogService.queryDriverTripLogs(filter, options, searchQuery);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getDriverTriplogsByIncidentId = catchAsync(async (req, res) => {
  const incidentId = req.body.incidentId
  const obj = {incidentId};
  const filter = obj;
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  // const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  // const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const result = await driverTriplogService.getDriverTripLogsByIncidentId(filter, options, searchQuery, incidentId); ///, options, searchQuery
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getDriverTriplogByVehicleId = catchAsync(async (req, res) => {
  const vehicleId = req.body.vehicleId;
  const fromLogNo = req.body.filter.fromLogNo ? req.body.filter.fromLogNo : '';
  const toLogNo = fromLogNo ? req.body.filter.toLogNo ? req.body.filter.toLogNo : +req.body.filter.fromLogNo+19 : '';
  // console.log("fromLogNo", fromLogNo)
  // console.log("toLogNo", toLogNo)
  const obj = { vehicleId, fromLogNo, toLogNo };
  const filter = obj;
  if (fromLogNo == ''){
    delete filter.fromLogNo
  }
  if (toLogNo == ''){
    delete filter.toLogNo

  }
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  // const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  // const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const result = await driverTriplogService.getDriverTriplogByVehicleId(filter, options, searchQuery, vehicleId); ///, options, searchQuery
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getDriverTriplog = catchAsync(async (req, res) => {
  const driverTriplog = await driverTriplogService.getDriverTripLogById(req.body.id);
  if (!driverTriplog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver Triplog not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: driverTriplog,
  });
});

const updateDriverTriplog = catchAsync(async (req, res) => {
  const driverTriplog = await driverTriplogService.updateDriverTripLogById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: driverTriplog,
  });
});

const deleteDriverTriplog = catchAsync(async (req, res) => {
  const driverTriplog = await driverTriplogService.deleteDriverTripLogById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: driverTriplog,
  });
});

module.exports = {
  createDriverTriplog,
  getDriverTriplogs,
  getDriverTriplog,
  updateDriverTriplog,
  deleteDriverTriplog,
  getDriverTriplogsByIncidentId,
  getDriverTriplogByVehicleId
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { vehicleDetailService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createVehicleDetail = catchAsync(async (req, res) => {
  //   console.log("reqested User", req.body);
  const vehicleDetail = await vehicleDetailService.createVehicleDetail(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: vehicleDetail,
  });
});

const getVehicleDetails = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const result = await vehicleDetailService.queryVehicleDetails(filter, options, searchQuery);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result
  });
});

const getVehicleDetailbyCenterId = catchAsync(async (req, res) => {
  const centerId = req.body.centerId
  const subCenterId = req.body.subCenterId
  const obj = { centerId, subCenterId };
  const filter = obj;
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await vehicleDetailService.getVehicleDetailbyCenterId(filter, options, searchQuery);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getVehicleDetail = catchAsync(async (req, res) => {
  const vehicleDetail = await vehicleDetailService.getVehicleDetailById(req.body.id);
  if (!vehicleDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Detail not found");
  }
  const vehicleData = vehicleDetail.toJSON()
  vehicleData.oldDriverId = vehicleDetail.driverId;
  // let driver = { oldDriverId: vehicleDetail.driverId };
  // Object.assign(vehicleData, driver);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: vehicleData
  });
});

const updateVehicleDetail = catchAsync(async (req, res) => {
  const vehicleDetail = await vehicleDetailService.updateVehicleDetailById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: vehicleDetail,
  });
});


const updateVehicleStatusDetail = catchAsync(async (req, res) => {
  const vehicleDetail = await vehicleDetailService.updateVehicleStatusById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK
  });
});

const deleteVehicleDetail = catchAsync(async (req, res) => {
  const vehicleDetail = await vehicleDetailService.deleteVehicleDetailById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: vehicleDetail,
  });
});

module.exports = {
  createVehicleDetail,
  getVehicleDetails,
  getVehicleDetail,
  updateVehicleDetail,
  updateVehicleStatusDetail,
  deleteVehicleDetail,
  getVehicleDetailbyCenterId
};

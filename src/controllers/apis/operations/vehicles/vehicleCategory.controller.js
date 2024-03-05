const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { vehicleCategoryService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createVehicleCategory = catchAsync(async (req, res) => {
//   console.log("reqested User", req.body);
  const vehicleCategory  = await vehicleCategoryService.createVehicleCategory(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: vehicleCategory,
  });
});

const getVehicleCategories = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await vehicleCategoryService.queryVehicleCategories(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getVehicleCategory = catchAsync(async (req, res) => {
  const vehicleCategory  = await vehicleCategoryService.getVehicleCategoryById(req.body.id);
  if (!vehicleCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Category not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: vehicleCategory,
  });
});

const updateVehicleCategory = catchAsync(async (req, res) => {
  const vehicleCategory  = await vehicleCategoryService.updateVehicleCategoryById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: vehicleCategory,
  });
});

const deleteVehicleCategory = catchAsync(async (req, res) => {
  const vehicleCategory = await vehicleCategoryService.deleteVehicleCategoryById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: vehicleCategory,
  });
});

module.exports = {
  createVehicleCategory,
  getVehicleCategories,
  getVehicleCategory,
  updateVehicleCategory,
  deleteVehicleCategory,
};

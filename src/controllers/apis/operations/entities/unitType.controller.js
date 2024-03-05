const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { unitTypeService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createUnitType = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  const unitType = await unitTypeService.createUnitType(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: unitType,
  });
});

const getUnitTypes = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await unitTypeService.queryUnitTypes(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getUnitType = catchAsync(async (req, res) => {
  const unitType = await unitTypeService.getUnitTypeById(req.body.id);
  if (!unitType) {
    throw new ApiError(httpStatus.NOT_FOUND, "Unit Type not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: unitType,
  });
});

const updateUnitType = catchAsync(async (req, res) => {
  const unitType = await unitTypeService.updateUnitTypeById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: unitType,
  });
});

const deleteUnitType = catchAsync(async (req, res) => {
  const unitType = await unitTypeService.deleteUnitTypeById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: unitType,
  });
});

module.exports = {
  createUnitType,
  getUnitTypes,
  getUnitType,
  updateUnitType,
  deleteUnitType,
};

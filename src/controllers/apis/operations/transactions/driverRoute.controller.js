const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { driverRouterService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createDriverRoute = catchAsync(async (req, res) => {
  console.log("reqested User", req.body);
  const driverRoute = await driverRouterService.createDriverRoute(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: driverRoute,
  });
});

const getDriverRoutes = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await driverRouterService.queryDriverRoutes(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getDriverRoute = catchAsync(async (req, res) => {
  const driverRoute = await driverRouterService.getDriverRouteById(req.body.id);
  if (!driverRoute) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver Route not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: driverRoute,
  });
});

const updateDriverRoute = catchAsync(async (req, res) => {
  const driverRoute = await driverRouterService.updateDriverRouteById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: driverRoute,
  });
});

const deleteDriverRoute = catchAsync(async (req, res) => {
  const driverRoute = await driverRouterService.deleteDriverRouteById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: driverRoute,
  });
});

module.exports = {
  createDriverRoute,
  getDriverRoutes,
  getDriverRoute,
  updateDriverRoute,
  deleteDriverRoute,
};

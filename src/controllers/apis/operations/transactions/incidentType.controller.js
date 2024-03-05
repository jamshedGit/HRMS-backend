const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { incidentTypeService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createIncidentType = catchAsync(async (req, res) => {
//   console.log("reqested User", req.body);
  const incidentType = await incidentTypeService.createIncidentType(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: incidentType,
  });
});

const getIncidentTypes = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await incidentTypeService.queryIncidentTypes(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getIncidentType = catchAsync(async (req, res) => {
  const incidentType = await incidentTypeService.getIncidentTypeById(req.body.id);
  if (!incidentType) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Type not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentType,
  });
});

const updateIncidentType = catchAsync(async (req, res) => {
  const incidentType = await incidentTypeService.updateIncidentTypeById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentType,
  });
});

const deleteIncidentType = catchAsync(async (req, res) => {
  const incidentType = await incidentTypeService.deleteIncidentTypeById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentType,
  });
});

module.exports = {
  createIncidentType,
  getIncidentTypes,
  getIncidentType,
  updateIncidentType,
  deleteIncidentType,
};

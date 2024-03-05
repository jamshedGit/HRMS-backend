const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { incidentSeverityService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createIncidentSeverity = catchAsync(async (req, res) => {
//   console.log("reqested User", req.body);
  const incidentSeverity = await incidentSeverityService.createIncidentSeverity(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: incidentSeverity,
  });
});

const getIncidentSeverities = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await incidentSeverityService.queryIncidentSeverities(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getIncidentSeverity = catchAsync(async (req, res) => {
  const incidentSeverity = await incidentSeverityService.getIncidentSeverityById(req.body.id);
  if (!incidentSeverity) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Severity not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentSeverity,
  });
});

const updateIncidentSeverity = catchAsync(async (req, res) => {
  const incidentSeverity = await incidentSeverityService.updateIncidentSeverityById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentSeverity,
  });
});

const deleteIncidentSeverity = catchAsync(async (req, res) => {
  const incidentSeverity = await incidentSeverityService.deleteIncidentSeverityById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentSeverity,
  });
});

module.exports = {
  createIncidentSeverity,
  getIncidentSeverities,
  getIncidentSeverity,
  updateIncidentSeverity,
  deleteIncidentSeverity,
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { incidentDetailService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createIncidentDetail = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  const incidentDetail = await incidentDetailService.createIncidentDetail(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: incidentDetail,
  });
});

const getIncidentDetails = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const result = await incidentDetailService.queryIncidentDetails(filter, options, searchQuery);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getIncidentDetail = catchAsync(async (req, res) => {
  const incidentDetail = await incidentDetailService.getIncidentDetailById(req.body.id);
  if (!incidentDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Detail not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentDetail,
  });
});

const updateIncidentDetail = catchAsync(async (req, res) => {
  
  const incidentDetail = await incidentDetailService.updateIncidentDetailById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentDetail,
  });
});

const deleteIncidentDetail = catchAsync(async (req, res) => {
  const incidentDetail = await incidentDetailService.deleteIncidentDetailById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: incidentDetail,
  });
});

module.exports = {
  createIncidentDetail,
  getIncidentDetails,
  getIncidentDetail,
  updateIncidentDetail,
  deleteIncidentDetail,
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const IncidentformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createIncident = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Incident")
    console.log(req.body);
    const Incident = await IncidentformService.IncidentServicePage.createIncident(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Incident
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllIncident = catchAsync(async (req, res) => {
  console.log("get Incidents");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await IncidentformService.IncidentServicePage.SP_getAllIncidentInfo(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllIncidentInfoByEmpId = catchAsync(async (req, res) => {
  console.log("Incident Controller getIncidentId")
  console.log(req.body)
  const Receipt = await IncidentformService.IncidentServicePage.SP_getAllIncidentInfoByEmpId(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getIncidentById = catchAsync(async (req, res) => {
  console.log("Incident Controller getIncidentId")
  console.log(req.body)
  const Receipt = await IncidentformService.IncidentServicePage.getIncidentById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateIncident = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await IncidentformService.IncidentServicePage.updateIncidentById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteIncident = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await IncidentformService.IncidentServicePage.deleteIncidentById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createIncident,
  getAllIncident,
  getIncidentById,
  updateIncident,
  deleteIncident,
  SP_getAllIncidentInfoByEmpId
};

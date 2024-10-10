const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const salarypolicyformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createsalarypolicy = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {


    const salarypolicy = await salarypolicyformService.salarypolicyFormService.createsalarypolicy(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: salarypolicy
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllsalarypolicys = catchAsync(async (req, res) => {
  console.log("get salarypolicys");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  console.log("searchQuery",searchQuery)
  const result = await salarypolicyformService.salarypolicyFormService.querysalarypolicys(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getsalarypolicyById = catchAsync(async (req, res) => {
  console.log("salarypolicy Controller getsalarypolicyId")
  console.log(req.body)
  const Receipt = await salarypolicyformService.salarypolicyFormService.getsalarypolicyById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updatesalarypolicy = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await salarypolicyformService.salarypolicyFormService.updatesalarypolicyById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deletesalarypolicy = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await salarypolicyformService.salarypolicyFormService.deletesalarypolicyById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getCurrentMonth = catchAsync(async (req, res) => {
  console.log("get current month");
  // const obj = {};
  // const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  // const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  // const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await salarypolicyformService.salarypolicyFormService.getCurrentMonth();
  console.log("resp2",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

module.exports = {
  createsalarypolicy,
  getAllsalarypolicys,
  getsalarypolicyById,
  updatesalarypolicy,
  deletesalarypolicy,
  getCurrentMonth
};

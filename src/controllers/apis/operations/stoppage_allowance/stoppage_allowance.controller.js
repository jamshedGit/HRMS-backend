const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const StoppageAllowanceformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createStoppageAllowance = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert StoppageAllowance")
    console.log(req.body);
    const StoppageAllowance = await StoppageAllowanceformService.StoppageAllowanceServicePage.createStoppageAllowance(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: StoppageAllowance
    });

  } catch (error) {
    console.log(error);
  }
});

const getAllStoppageAllowance = catchAsync(async (req, res) => {
  console.log("get StoppageAllowances");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await StoppageAllowanceformService.StoppageAllowanceServicePage.SP_getAllStoppageAllowanceInfo(filter, options, searchQuery, req.body.id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllStoppageAllowanceInfoByEmpId = catchAsync(async (req, res) => {
  console.log("StoppageAllowance Controller getStoppageAllowanceId")
  console.log(req.body)
  const Receipt = await StoppageAllowanceformService.StoppageAllowanceServicePage.SP_getAllStoppageAllowanceInfoByEmpId(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


const SP_getAllEarningDeductionList = catchAsync(async (req, res) => {
  console.log("SP_getAllEarningDeductionList Controller",req.body)

  const list = await StoppageAllowanceformService.StoppageAllowanceServicePage.SP_GetAllEarningDeductionList(req.body.flag);
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, "list not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: list,
  });
});


const getStoppageAllowanceById = catchAsync(async (req, res) => {
  console.log("StoppageAllowance Controller getStoppageAllowanceId")
  console.log(req.body)
  const Receipt = await StoppageAllowanceformService.StoppageAllowanceServicePage.getStoppageAllowanceById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateStoppageAllowance = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await StoppageAllowanceformService.StoppageAllowanceServicePage.updateStoppageAllowanceById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteStoppageAllowance = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body.Id)
  const Receipt = await StoppageAllowanceformService.StoppageAllowanceServicePage.deleteStoppageAllowanceById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createStoppageAllowance,
  getAllStoppageAllowance,
  getStoppageAllowanceById,
  updateStoppageAllowance,
  deleteStoppageAllowance,
  SP_getAllStoppageAllowanceInfoByEmpId,
  SP_getAllEarningDeductionList
};

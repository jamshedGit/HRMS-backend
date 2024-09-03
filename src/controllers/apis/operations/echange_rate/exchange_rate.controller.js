const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const ExchangeRateformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createExchangeRate = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert ExchangeRate")
    console.log(req.body);
    const ExchangeRate = await ExchangeRateformService.ExchangeRateServicePage.createExchangeRate(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: ExchangeRate
    });

  } catch (error) {
    console.log(error);
  }
});

const getAllExchangeRate = catchAsync(async (req, res) => {
  console.log("get ExchangeRates");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await ExchangeRateformService.ExchangeRateServicePage.SP_getAllExchangeRateInfo(filter, options, searchQuery, req.body.id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllExchangeRateInfoByEmpId = catchAsync(async (req, res) => {
  console.log("ExchangeRate Controller getExchangeRateId")
  console.log(req.body)
  const Receipt = await ExchangeRateformService.ExchangeRateServicePage.SP_getAllExchangeRateInfoByEmpId(req.body.Id);
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

  const list = await ExchangeRateformService.ExchangeRateServicePage.SP_GetAllEarningDeductionList(req.body.flag);
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, "list not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: list,
  });
});


const getExchangeRateById = catchAsync(async (req, res) => {
  console.log("ExchangeRate Controller getExchangeRateId")
  console.log(req.body)
  const Receipt = await ExchangeRateformService.ExchangeRateServicePage.getExchangeRateById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateExchangeRate = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await ExchangeRateformService.ExchangeRateServicePage.updateExchangeRateById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteExchangeRate = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body.Id)
  const Receipt = await ExchangeRateformService.ExchangeRateServicePage.deleteExchangeRateById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createExchangeRate,
  getAllExchangeRate,
  getExchangeRateById,
  updateExchangeRate,
  deleteExchangeRate,
  SP_getAllExchangeRateInfoByEmpId,
  SP_getAllEarningDeductionList
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const EarningformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEarning = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Earning")
    console.log(req.body);
    const Earning = await EarningformService.EarningServicePage.createEarning(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Earning
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllEarning = catchAsync(async (req, res) => {
  console.log("get Earnings");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await EarningformService.EarningServicePage.SP_getAllEarningInfo(filter, options,searchQuery,req.body.id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllEarningInfoByEmpId = catchAsync(async (req, res) => {
  console.log("Earning Controller getEarningId")
  console.log(req.body)
  const Receipt = await EarningformService.EarningServicePage.SP_getAllEarningInfoByEmpId(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getEarningById = catchAsync(async (req, res) => {
  console.log("Earning Controller getEarningId")
  console.log(req.body)
  const Receipt = await EarningformService.EarningServicePage.getEarningById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateEarning = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await EarningformService.EarningServicePage.updateEarningById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteEarning = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await EarningformService.EarningServicePage.deleteEarningById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createEarning,
  getAllEarning,
  getEarningById,
  updateEarning,
  deleteEarning,
  SP_getAllEarningInfoByEmpId
};

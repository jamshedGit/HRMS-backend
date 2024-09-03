const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const EarningTranformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEarningTran = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert EarningTran")
    console.log(req.body);
    const EarningTran = await EarningTranformService.EarningTransactionServicePage.createEarningTran(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: EarningTran
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllEarningTran = catchAsync(async (req, res) => {
  console.log("get EarningTrans");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await EarningTranformService.EarningTransactionServicePage.SP_getAllEarningTranInfo(filter, options,searchQuery,req.body.id,req.body.transactionType);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllEarningTranInfoByEmpId = catchAsync(async (req, res) => {
  console.log("EarningTran Controller getEarningTranId")
  console.log(req.body)
  const Receipt = await EarningTranformService.EarningTranServicePage.SP_getAllEarningTranInfoByEmpId(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getEarningTranById = catchAsync(async (req, res) => {
  console.log("EarningTran Controller getEarningTranId")
  console.log(req.body)
  const Receipt = await EarningTranformService.EarningTransactionServicePage.getEarningTranById(req.body.id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateEarningTran = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await EarningTranformService.EarningTransactionServicePage.updateEarningTranById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteEarningTran = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await EarningTranformService.EarningTransactionServicePage.deleteEarningTranById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createEarningTran,
  getAllEarningTran,
  getEarningTranById,
  updateEarningTran,
  deleteEarningTran,
  SP_getAllEarningTranInfoByEmpId
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { transactionDetailService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createTransactionDetail = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  const transactionDetail = await transactionDetailService.createtransactionDetail(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: transactionDetail,
  });
});

const getTransactionDetails = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await transactionDetailService.queryTransactionDetails(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getTransactionDetail = catchAsync(async (req, res) => {
  const transactionDetail = await transactionDetailService.getTransactionDetailById(req.body.id);
  if (!transactionDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction Detail not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: transactionDetail,
  });
});

const updateTransactionDetail = catchAsync(async (req, res) => {
  const transactionDetail = await transactionDetailService.updateTransactionDetailById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: transactionDetail,
  });
});

const deleteTransactionDetail = catchAsync(async (req, res) => {
  const transactionDetail = await transactionDetailService.deleteTransactionDetailById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: transactionDetail,
  });
});

module.exports = {
  createTransactionDetail,
  getTransactionDetails,
  getTransactionDetail,
  updateTransactionDetail,
  deleteTransactionDetail,
};

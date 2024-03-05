const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { transactionMasterService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createTransactionMaster = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  const transactionMaster = await transactionMasterService.createtransactionMaster(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: transactionMaster,
  });
});

const getTransactionMasters = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await transactionMasterService.queryTransactionMasters(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getTransactionMaster = catchAsync(async (req, res) => {
  const transactionMaster = await transactionMasterService.getTransactionMasterById(req.body.id);
  if (!transactionMaster) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction Master not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: transactionMaster,
  });
});

const updateTransactionMaster = catchAsync(async (req, res) => {
  const transactionMaster = await transactionMasterService.updateTransactionMasterById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: transactionMaster,
  });
});

const deleteTransactionMaster = catchAsync(async (req, res) => {
  const transactionMaster = await transactionMasterService.deleteTransactionMasterById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: transactionMaster,
  });
});

module.exports = {
  createTransactionMaster,
  getTransactionMasters,
  getTransactionMaster,
  updateTransactionMaster,
  deleteTransactionMaster,
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { donationReceiptFormService } = require("../../../../services");



const { 
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createReceipt = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  console.log("insert receipt")
  console.log(req.user.id);
  const Receipt = await donationReceiptFormService.createReceipt(req, req.body);

  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: Receipt
  });
});



const getReceipts = catchAsync(async (req, res) => {
  console.log("get receipts");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';

  const result = await donationReceiptFormService.queryReceipts(filter, options,searchQuery);
  //  console.log("result");
  //  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getReceipt = catchAsync(async (req, res) => {
  console.log("Receipt Controller")
  console.log(req.body)
  const Receipt = await donationReceiptFormService.getReceiptById(req.body.receiptId);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateReceipt = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await donationReceiptFormService.updateReceiptById(req.body.receiptId, req.body, req.user.receptId);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteReceipt = catchAsync(async (req, res) => {
  console.log("req.body.receptId " ,req.body.receiptId)
  const Receipt = await donationReceiptFormService.deleteReceiptById(req.body.receiptId);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getDonationReceiptReport = catchAsync(async (req, res) => {
  console.log("req.body.donation report " ,req.body);
  const edrsDonationReport = await donationReceiptFormService.getDonationReceiptReport(req.body);
  if (!edrsDonationReport) {
      throw new ApiError(httpStatus.NOT_FOUND, "Donation Report not found");
  }
  res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: edrsDonationReport,
  });
});

const getMaxbookingNoForReceipt = catchAsync(async (req, res) => {
  console.log("get max booking no - controller " ,req);
  const edrsDonationReport = await donationReceiptFormService.getMaxBookingNo(req.body);
  if (!edrsDonationReport) {
      throw new ApiError(httpStatus.NOT_FOUND, "Donation Report not found");
  }
  res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,   
      data: edrsDonationReport,
  });
});


module.exports = {
  createReceipt,
  getReceipts,
  getReceipt,
  updateReceipt,
  deleteReceipt,
  getDonationReceiptReport,
  getMaxbookingNoForReceipt
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const EmployeeTransferServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEmployeeTransfer = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert EmployeeTransfer")
    console.log(req.body);
    const EmployeeTransfer = await EmployeeTransferServicePage.EmployeeTransferServicePage.createEmployeeTransfer(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: EmployeeTransfer
    });

  } catch (error) {
    console.log(error);
  }
});

const getAllEmployeeTransfer = catchAsync(async (req, res) => {
  console.log("get EmployeeTransfers",req.body.id);
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await EmployeeTransferServicePage.EmployeeTransferServicePage.SP_getAllEmployeeTransferInfo(filter, options, searchQuery, req.body.id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllEmployeeTransferInfoByEmpId = catchAsync(async (req, res) => {
  console.log("EmployeeTransfer Controller getEmployeeTransferId")
  console.log(req.body)
  const obj = await EmployeeTransferServicePage.EmployeeTransferServicePage.SP_getAllEmployeeTransferInfoByEmpId(req.body.employeeId);
  if (!obj) {
    throw new ApiError(httpStatus.NOT_FOUND, "obj not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: obj,
  });
});


const SP_getAllEarningDeductionList = catchAsync(async (req, res) => {
  console.log("SP_getAllEarningDeductionList Controller",req.body)

  const list = await EmployeeTransferServicePage.EmployeeTransferServicePage.SP_GetAllEarningDeductionList(req.body.flag);
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, "list not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: list,
  });
});


const getEmployeeTransferById = catchAsync(async (req, res) => {
  console.log("EmployeeTransfer Controller getEmployeeTransferId")
  console.log(req.body)
  const obj = await EmployeeTransferServicePage.EmployeeTransferServicePage.getEmployeeTransferById(req.body.Id);
  //console.log("redeem",obj)
  if (!obj) {
    throw new ApiError(httpStatus.NOT_FOUND, "obj not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: obj,
  });
});

const updateEmployeeTransfer = catchAsync(async (req, res) => {
  console.log("transfer update",req.body);
  const obj = await EmployeeTransferServicePage.EmployeeTransferServicePage.updateEmployeeTransferById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: obj,
  });
});

const deleteEmployeeTransfer = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body.Id)
  const obj = await EmployeeTransferServicePage.EmployeeTransferServicePage.deleteEmployeeTransferById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: obj,
  });
});

const usp_InsertEmployeeTransferBulk = catchAsync(async (req, res) => {
  console.log("bulk emp transfer", req.body.data);
  const result = await EmployeeTransferServicePage.EmployeeTransferServicePage.usp_InsertEmployeeTransferBulk(req.body.data.list);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});



module.exports = {
  createEmployeeTransfer,
  getAllEmployeeTransfer,
  getEmployeeTransferById,
  updateEmployeeTransfer,
  deleteEmployeeTransfer,
  SP_getAllEmployeeTransferInfoByEmpId,
  SP_getAllEarningDeductionList,
  usp_InsertEmployeeTransferBulk
};

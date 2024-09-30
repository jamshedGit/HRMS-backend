const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const PayrollMonthServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createPayrollMonth = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert PayrollMonth")
    console.log(req.body);
    const PayrollMonth = await PayrollMonthServicePage.PayrollMonthServicePage.createPayrollMonth(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: PayrollMonth
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllPayrollMonth = catchAsync(async (req, res) => {
  console.log("get PayrollMonths");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await PayrollMonthServicePage.PayrollMonthServicePage.queryPayrollMonths(filter, options,searchQuery);
  console.log("resp2",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_GetActivePreviousPayrollMonth = catchAsync(async (req, res) => {
  
  console.log("active payroll month",req.body)
  const obj = await PayrollMonthServicePage.PayrollMonthServicePage.SP_GetActivePreviousPayrollMonth(req.body.employeeId);
  if (!obj) {
    throw new ApiError(httpStatus.NOT_FOUND, "obj not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: obj,
  });
});



const getPayrollMonthById = catchAsync(async (req, res) => {
  console.log("PayrollMonth Controller getPayrollMonthId")
  console.log(req.body)
  const Receipt = await PayrollMonthServicePage.PayrollMonthServicePage.getPayrollMonthById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updatePayrollMonth = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await PayrollMonthServicePage.PayrollMonthServicePage.updatePayrollMonthById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deletePayrollMonth = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await PayrollMonthServicePage.PayrollMonthServicePage.deletePayrollMonthById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createPayrollMonth,
  getAllPayrollMonth,
  getPayrollMonthById,
  updatePayrollMonth,
  deletePayrollMonth,
  SP_GetActivePreviousPayrollMonth
};

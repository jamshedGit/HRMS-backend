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
 
  try {

    const PayrollMonth = await PayrollMonthServicePage.PayrollMonthServicePage.createPayrollMonth(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: PayrollMonth
    });

  } catch (error) {

    if (error?.parent?.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
});

const getAllPayrollMonth = catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await PayrollMonthServicePage.PayrollMonthServicePage.queryPayrollMonths(req,filter, options, searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_GetActivePreviousPayrollMonth = catchAsync(async (req, res) => {


  const obj = await PayrollMonthServicePage.PayrollMonthServicePage.SP_GetActivePreviousPayrollMonth(req.body.subsidiaryId, req.body.employeeId);
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

  const Receipt = await PayrollMonthServicePage.PayrollMonthServicePage.updatePayrollMonthById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deletePayrollMonth = catchAsync(async (req, res) => {
  try {
    const Receipt = await PayrollMonthServicePage.PayrollMonthServicePage.deletePayrollMonthById(req.body.Id);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: Receipt,
    });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record is in another used!");
  }
});


module.exports = {
  createPayrollMonth,
  getAllPayrollMonth,
  getPayrollMonthById,
  updatePayrollMonth,
  deletePayrollMonth,
  SP_GetActivePreviousPayrollMonth
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { expenseCategoryService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createExpenseCategory = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  const expenseCategory = await expenseCategoryService.createExpenseCategory(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: expenseCategory,
  });
});

const getExpenseCategories = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await expenseCategoryService.queryExpenseCategories(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getExpenseCategory = catchAsync(async (req, res) => {
  const expenseCategory = await expenseCategoryService.getExpenseCategoryById(req.body.id);
  if (!expenseCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Expense Category not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: expenseCategory,
  });
});

const updateExpenseCategory = catchAsync(async (req, res) => {
  const expenseCategory = await expenseCategoryService.updateExpenseCategoryById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: expenseCategory,
  });
});

const deleteExpenseCategory = catchAsync(async (req, res) => {
  const expenseCategory = await expenseCategoryService.deleteExpenseCategoryById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: expenseCategory,
  });
});

module.exports = {
  createExpenseCategory,
  getExpenseCategories,
  getExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
};

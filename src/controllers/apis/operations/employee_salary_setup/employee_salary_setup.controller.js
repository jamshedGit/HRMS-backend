const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const EmployeeSalarySetupServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEmployeeSalary = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert EmployeeSalary")
    console.log(req.body);
    const EmployeeSalary = await EmployeeSalarySetupServicePage.EmployeeSalarySetupServicePage.createEmployeeSalary(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: EmployeeSalary
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllEmployeeSalary = catchAsync(async (req, res) => {
  console.log("get EmployeeSalarys");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await EmployeeSalarySetupServicePage.EmployeeSalarySetupServicePage.SP_getAllEmployeeSalaryInfo(filter, options,searchQuery,req.body.id,req.body.transactionType);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllEmployeeSalaryInfoByEmpId = catchAsync(async (req, res) => {
  console.log("EmployeeSalary EmpId")
  console.log(req.body)
  const response = await EmployeeSalarySetupServicePage.EmployeeSalarySetupServicePage.SP_getAllEmployeeSalaryInfoByEmpId(req.body.id,req.body.transactionType);
 
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const getEmployeeSalaryById = catchAsync(async (req, res) => {
  console.log("EmployeeSalaryformService Controller getEmployeeSalaryId")
  console.log(req.body)
  const response = await EmployeeSalarySetupServicePage.EmployeeSalarySetupServicePage.getEmployeeSalaryById(req.body.Id);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const updateEmployeeSalary = catchAsync(async (req, res) => {
  console.log(req.body);
  const response = await EmployeeSalarySetupServicePage.EmployeeSalarySetupServicePage.updateEmployeeSalaryById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const deleteEmployeeSalary = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const response = await EmployeeSalarySetupServicePage.EmployeeSalarySetupServicePage.deleteEmployeeSalaryById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


module.exports = {
  createEmployeeSalary,
  getAllEmployeeSalary,
  getEmployeeSalaryById,
  updateEmployeeSalary,
  deleteEmployeeSalary,
  SP_getAllEmployeeSalaryInfoByEmpId
};

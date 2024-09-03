const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const EmployeeSalaryExpatriateServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEmployeeSalaryExpatriate = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert EmployeeSalaryExpatriate")
    console.log(req.body);
    const EmployeeSalaryExpatriate = await EmployeeSalaryExpatriateServicePage.EmployeeSalaryExpatriateServicePage.createEmployeeSalaryExpatriate(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: EmployeeSalaryExpatriate
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllEmployeeSalaryExpatriate = catchAsync(async (req, res) => {
  console.log("get EmployeeSalaryExpatriates");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await EmployeeSalaryExpatriateServicePage.EmployeeSalaryExpatriateServicePage.SP_getAllEmployeeSalaryExpatriateInfo(filter, options,searchQuery,req.body.id,req.body.transactionType);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const usp_GetCompensationExpatriatePolicyByEmpSalary = catchAsync(async (req, res) => {
  
  const obj = {};
  const filter = obj;
 console.log("req.body",req.body)
  const result = await EmployeeSalaryExpatriateServicePage.EmployeeSalaryExpatriateServicePage.usp_GetCompensationExpatriatePolicyByEmpSalary(req.body.employeeId);
  console.log("com exp",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllEmployeeSalaryExpatriateInfoByEmpId = catchAsync(async (req, res) => {
  console.log("EmployeeSalaryExpatriate EmpId")
  console.log(req.body)
  const response = await EmployeeSalaryExpatriateServicePage.EmployeeSalaryExpatriateServicePage.SP_getAllEmployeeSalaryExpatriateInfoByEmpId(req.body.id,req.body.transactionType);
 
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const getEmployeeSalaryExpatriateById = catchAsync(async (req, res) => {
  console.log("EmployeeSalaryExpatriateformService Controller getEmployeeSalaryExpatriateId")
  console.log(req.body)
  const response = await EmployeeSalaryExpatriateServicePage.EmployeeSalaryExpatriateServicePage.getEmployeeSalaryExpatriateById(req.body.Id);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const updateEmployeeSalaryExpatriate = catchAsync(async (req, res) => {
  console.log(req.body);
  const response = await EmployeeSalaryExpatriateServicePage.EmployeeSalaryExpatriateServicePage.updateEmployeeSalaryExpatriateById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const deleteEmployeeSalaryExpatriate = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const response = await EmployeeSalaryExpatriateServicePage.EmployeeSalaryExpatriateServicePage.deleteEmployeeSalaryExpatriateById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


module.exports = {
  createEmployeeSalaryExpatriate,
  getAllEmployeeSalaryExpatriate,
  getEmployeeSalaryExpatriateById,
  updateEmployeeSalaryExpatriate,
  deleteEmployeeSalaryExpatriate,
  SP_getAllEmployeeSalaryExpatriateInfoByEmpId,
  usp_GetCompensationExpatriatePolicyByEmpSalary
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const Employee_Salary_Earning_Deduction_formService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEmployeeSalary = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert EmployeeSalary")
    console.log(req.body);
    const EmployeeSalary = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.createEmployeeSalary(req, req.body);
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
  const result = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.SP_getAllEmployeeSalaryInfo(filter, options,searchQuery,req.body.id,req.body.transactionType);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const SP_getAllEmployeeSalaryInfoForDDL = catchAsync(async (req, res) => {
 
  const result = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.SP_getAllEmployeeSalaryInfoForDDL(req.body.employeeId);
  console.log(result);  
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const usp_GetAllSalary_Earning_DeductionByEmpId = catchAsync(async (req, res) => {
  console.log("EmployeeSalary 123 EmpId")
  console.log(req.body)
  const response = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.usp_GetAllSalary_Earning_DeductionByEmpId(req.body.id,req.body.basicSalary);
  console.log("doll",response);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


const usp_UpdateSalaryEarningDeductionBulk = catchAsync(async (req, res) => {
 console.log("bulk",req.body);
  const response = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.usp_Update_Salary_Earning_Deduction_Bulk(req.body.data.emp_ed_Obj,req.body.data.employeeId);
  console.log("doll",response);
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
  const response = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.getEmployeeSalaryById(req.body.Id);
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
  const response = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.updateEmployeeSalaryById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const deleteEmployeeSalary = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const response = await Employee_Salary_Earning_Deduction_formService.EmployeeSalaryEarningDeductionServicePage.deleteEmployeeSalaryById(req.body.Id);
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
  usp_GetAllSalary_Earning_DeductionByEmpId,
  usp_UpdateSalaryEarningDeductionBulk,
  SP_getAllEmployeeSalaryInfoForDDL
};

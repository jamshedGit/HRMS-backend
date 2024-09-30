const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const EmployeeSalaryRevisionServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEmployeeSalaryRevision = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("bulk revision", req.body.data.mergeList);
    const response = await EmployeeSalaryRevisionServicePage.EmployeeSalaryRevisionServicePage.usp_InsertUpdateSalaryRevisionDetails(req.body.data.mergeList[0],req.body.data.newObjList);
   
    if (!response) {
      throw new ApiError(httpStatus.NOT_FOUND, "response not found");
    }
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: response,
    });

  } catch (error) {
    console.log(error);
  }
});



const getAllEmployeeSalaryRevision = catchAsync(async (req, res) => {
  console.log("get EmployeeSalarys");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await EmployeeSalaryRevisionServicePage.EmployeeSalaryRevisionServicePage.SP_getAllEmployeeSalaryInfo(filter, options, searchQuery, req.body.id, req.body.transactionType);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllEmployeeSalaryRevisionInfoByEmpId = catchAsync(async (req, res) => {
  console.log("EmployeeSalary EmpId")
  console.log(req.body)
  const response = await EmployeeSalaryRevisionServicePage.EmployeeSalaryRevisionServicePage.SP_getAllEmployeeSalaryInfoByEmpId(req.body.id, req.body.transactionType);

  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const getEmployeeSalaryRevisionById = catchAsync(async (req, res) => {
  console.log("EmployeeSalaryformService Controller getEmployeeSalaryId")
  console.log(req.body)
  const response = await EmployeeSalaryRevisionServicePage.EmployeeSalaryRevisionServicePage.getEmployeeSalaryById(req.body.Id);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const updateEmployeeSalaryRevision = catchAsync(async (req, res) => {
  console.log(req.body);
  const response = await EmployeeSalaryRevisionServicePage.EmployeeSalaryRevisionServicePage.updateEmployeeSalaryById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const deleteEmployeeSalaryRevision = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body.Id)
  const response = await EmployeeSalaryRevisionServicePage.EmployeeSalaryRevisionServicePage.deleteEmployeeSalaryById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


module.exports = {
  createEmployeeSalaryRevision,
  getAllEmployeeSalaryRevision,
  getEmployeeSalaryRevisionById,
  updateEmployeeSalaryRevision,
  deleteEmployeeSalaryRevision,
  SP_getAllEmployeeSalaryRevisionInfoByEmpId
  
};

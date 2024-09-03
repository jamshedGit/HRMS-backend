const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");



const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");
const { employeeTypeFormService } = require("../../../../services");
// const { EmployeeTypeFormService } = require("../../../../services");

const createEmployeeType = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert EmployeeType")
    console.log("req body", req.body);
   
    req.body.createdBY = req.user.id;
    const Bank = await employeeTypeFormService.createEmployeeType(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  } catch (error) {
    console.log(error);
  }
});

const getAllEmployeeType = catchAsync(async (req, res) => {
  console.log("get EmployeeType");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await employeeTypeFormService.queryEmployeeType(filter, options, searchQuery);
  console.log("my result",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const getEmployeeTypeById = catchAsync(async (req, res) => {
  console.log("EmployeeType Controller EmployeeType Id", req.body.EmployeeTypeId.EmployeeTypeId)
  console.log(req.body)
  const EmployeeType = await employeeTypeFormService.getEmployeeTypeById(req.body.EmployeeTypeId);
  if (!EmployeeType) {
    throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: EmployeeType,
  });
});

const updateEmployeeType = catchAsync(async (req, res) => {
  console.log("EmployeeType_Id", req.body.EmployeeTypeId, req.body, req.user.id);
  const EmployeeType = await employeeTypeFormService.updateEmployeeTypeById(req.body.EmployeeTypeId, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: EmployeeType,
  });
});

const deleteEmployeeType = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body)
  const EmployeeType = await employeeTypeFormService.deleteEmployeeTypeById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: EmployeeType,
  });
});


module.exports = {
  createEmployeeType,
  getAllEmployeeType,
  getEmployeeTypeById,
  updateEmployeeType,
  deleteEmployeeType,
  
};

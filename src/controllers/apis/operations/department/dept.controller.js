const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");



const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");
const { deptFormService } = require("../../../../services");

const createDept = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert department")
    console.log("req body", req.body);
   
    req.body.createdBY = req.user.id;
    const Bank = await deptFormService.createDept(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  } catch (error) {
    console.log(error);
  }
});

const getAllDept = catchAsync(async (req, res) => {
  console.log("get dept");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await deptFormService.queryDept(filter, options, searchQuery);
  console.log("my result",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getAllParentDept = catchAsync(async (req, res) => {
  console.log("get parent dept");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await deptFormService.queryDept(filter, options, searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getDeptById = catchAsync(async (req, res) => {
  console.log("dept Controller department Id", req.body.deptId.deptId)
  console.log(req.body)
  const dept = await deptFormService.getDeptById(req.body.deptId);
  if (!dept) {
    throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: dept,
  });
});

const updateDept = catchAsync(async (req, res) => {
  console.log("dept_Id", req.body.deptId, req.body, req.user.id);
  const dept = await deptFormService.updateDeptById(req.body.deptId, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: dept,
  });
});

const deleteDept = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body)
  const dept = await deptFormService.deleteDeptById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: dept,
  });
});


module.exports = {
  createDept,
  getAllDept,
  getDeptById,
  updateDept,
  deleteDept,
  getAllParentDept
};

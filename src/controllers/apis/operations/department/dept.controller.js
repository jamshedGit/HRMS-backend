const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");



const {
  HttpStatusCodes,
  HttpResponseMessages,
  DDL_FIELD_NAMES,
} = require("../../../../utils/constants");
const { deptFormService } = require("../../../../services");

const createDept = catchAsync(async (req, res) => {

  try {


    req.body.createdBY = req.user.id;
    const Bank = await deptFormService.createDept(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  } catch (error) {

    if (error.parent.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
});

const getAllDept = catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await deptFormService.sp_GetAllDepartments(filter, options, searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getAllParentDept = catchAsync(async (req, res) => {

  // const obj = {};
  // const filter = obj;
  // // const options = pick(req.body, ["sortBy", "limit", "page"]);
  // const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  // const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  // const result = await deptFormService.queryDept(filter, options, searchQuery);

  // res.send({
  //   code: HttpStatusCodes.OK,
  //   message: HttpResponseMessages.OK,
  //   data: result,
  // });

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await deptFormService.sp_GetAllDepartments(filter, options, searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getDeptById = catchAsync(async (req, res) => {
 
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

  try {

   
    const dept = await deptFormService.updateDeptById(req.body.deptId, req.body, req.user.id);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: dept,
    });
  }
  catch (error) {

    if (error.parent.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
});

const deleteDept = catchAsync(async (req, res) => {
  try {

    const dept = await deptFormService.deleteDeptById(req.body.Id);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: dept,
    });

  } catch (error) {

    if (error.parent.errno === 1451) {
      throw new ApiError(httpStatus.NOT_FOUND,HttpResponseMessages.ASSOCIATED_RECORD);
    }
    else {

      throw error;
    }
  }
});


module.exports = {
  createDept,
  getAllDept,
  getDeptById,
  updateDept,
  deleteDept,
  getAllParentDept
};

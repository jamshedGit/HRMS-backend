const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const FormformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createForm = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Form")
    console.log(req.body);
    const Form = await FormformService.FormServicePage.createForm(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Form
    });

  } catch (error) {
    console.log(error);
  }
});

const getAllForms = catchAsync(async (req, res) => {
  console.log("get Forms");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  console.log("searchQuery", searchQuery);
  const result = await FormformService.FormServicePage.queryForm(filter, options, searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const getAllParentChildForms = catchAsync(async (req, res) => {
  console.log("get Forms menus");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  console.log("searchQuery", searchQuery);
  const result = await FormformService.FormServicePage.getAllParentChildForms(filter, options, searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});



const getAllChildForms = catchAsync(async (req, res) => {
  console.log("get Forms menus child", req.body);
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = {}; //pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = ''; // req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  //console.log("searchQuery",searchQuery);
  if (req.body.id) {
    req.body.parentId = req.body.id;
  }

  const result = await FormformService.FormServicePage.getAllChildForms(req.body.parentId, filter, options, searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});




const getFormById = catchAsync(async (req, res) => {
  console.log("Form Controller getFormId")
  console.log(req.body)
  const Receipt = await FormformService.FormServicePage.getFormById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "form not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateForm = catchAsync(async (req, res) => {
  console.log("req.body", req.body, req.user.Id);
  const Receipt = await FormformService.FormServicePage.updateFormById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteForm = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body.Id)
  const Receipt = await FormformService.FormServicePage.deleteFormById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  getAllParentChildForms,
  getAllChildForms

};

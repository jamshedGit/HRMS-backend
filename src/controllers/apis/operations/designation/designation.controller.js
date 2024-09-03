const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const DesignationformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createDesignation = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Designation")
    console.log("req body",req.body);
    req.body.Id = req.body.Id;
    
    delete req.body.Id;
    const Bank = await DesignationformService.designationFormService.createDesignation(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllDesignation = catchAsync(async (req, res) => {
  console.log("get Designation");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await DesignationformService.designationFormService.queryDesignation(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getDesignationById = catchAsync(async (req, res) => {
  console.log("Designation Controller getbankId")
  console.log(req.body)
  const Receipt = await DesignationformService.designationFormService.getDesignationById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Designation not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateDesignation = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await DesignationformService.designationFormService.updateDesignationById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteDesignation = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await DesignationformService.designationFormService.deleteDesignationById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createDesignation,
  getAllDesignation,
  getDesignationById,
  updateDesignation,
  deleteDesignation
};

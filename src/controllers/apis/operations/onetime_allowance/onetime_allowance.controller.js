const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const onetime_earningformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");
const { finalSetllementPolicy } = require("../..");

const create_onetime_earning = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert _onetime_earning")
    console.log(req.body);
    const _onetime_earning = await onetime_earningformService.OneTimeEarningService.createOneTimeEarning(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: _onetime_earning
    });

  } catch (error) {
    console.log(error);        
  }
});


const usp_GetAllOnetimeAllowanceDetails = catchAsync(async (req, res) => {
  console.log("usp_GetAllOnetimeAllowanceDetails",req.body.employeeId)
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const response = await onetime_earningformService.OneTimeEarningService.usp_GetAllOnetimeAllowanceDetails(req.body.employeeId);
  console.log("response::",response)
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});



const getAll_onetime_earning = catchAsync(async (req, res) => {
  console.log("query onetime allowance");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await onetime_earningformService.OneTimeEarningService.queryOneTimeEarnings(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const get_onetime_earningById = catchAsync(async (req, res) => {
  console.log("_onetime_earning Controller get_onetime_earningId")
  console.log(req.body)
  const Receipt = await onetime_earningformService.OneTimeEarningService.getOneTimeEarningById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const update_onetime_earning = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await onetime_earningformService.OneTimeEarningService.updateOneTimeEarningById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const delete_onetime_earning = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await onetime_earningformService.OneTimeEarningService.deleteOneTimeEarningById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


const usp_InsertOneTimeEarning = catchAsync(async (req, res) => {
  console.log("bulk",req.body);
   const response = await onetime_earningformService.OneTimeEarningService.usp_InsertOneTimeEarningPolicy(req.body,req.body.earningObjList);
  
   if (!response) {
     throw new ApiError(httpStatus.NOT_FOUND, "response not found");
   }
   res.send({
     code: HttpStatusCodes.OK,
     message: HttpResponseMessages.OK,
     data: response,
   });
 });


module.exports = {
  create_onetime_earning,
  getAll_onetime_earning,
  get_onetime_earningById,
  update_onetime_earning,
  delete_onetime_earning,
  usp_InsertOneTimeEarning,
  usp_GetAllOnetimeAllowanceDetails
};

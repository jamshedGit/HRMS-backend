const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const exitformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createexit = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert exit")
    console.log(req.body);
    const exit = await exitformService.exitFormService.createexit(req, req.body);

    // res.status(httpStatus.CREATED).send({
    //   code: HttpStatusCodes.CREATED,
    //   message: HttpResponseMessages.CREATED,
    //   data: exit
    // });

  } catch (error) {
    console.log(error);        
  }
});

const getAllexits = catchAsync(async (req, res) => {
  console.log("get exits");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  console.log("searchQuery",searchQuery)
  const result = await exitformService.exitFormService.queryexits(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getexitById = catchAsync(async (req, res) => {
  console.log("exit Controller getexitId")
  console.log(req.body)
  const Receipt = await exitformService.exitFormService.getexitById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateexit = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await exitformService.exitFormService.updateexitById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteexit = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await exitformService.exitFormService.deleteexitById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createexit,
  getAllexits,
  getexitById,
  updateexit,
  deleteexit
};

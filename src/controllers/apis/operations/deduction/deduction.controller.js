const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const DeductionformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createDeduction = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Deduction")
    console.log(req.body);
    const Deduction = await DeductionformService.DeductionServicePage.createDeduction(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Deduction
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllDeduction = catchAsync(async (req, res) => {
  console.log("get Deductions");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await DeductionformService.DeductionServicePage.SP_getAllDeductionInfo(filter, options,searchQuery,req.body.id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllDeductionInfoByEmpId = catchAsync(async (req, res) => {
  console.log("Deduction Controller getDeductionId")
  console.log(req.body)
  const Receipt = await DeductionformService.DeductionServicePage.SP_getAllDeductionInfoByEmpId(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getDeductionById = catchAsync(async (req, res) => {
  console.log("Deduction Controller getDeductionId")
  console.log(req.body)
  const Receipt = await DeductionformService.DeductionServicePage.getDeductionById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateDeduction = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await DeductionformService.DeductionServicePage.updateDeductionById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteDeduction = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await DeductionformService.DeductionServicePage.deleteDeductionById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createDeduction,
  getAllDeduction,
  getDeductionById,
  updateDeduction,
  deleteDeduction,
  SP_getAllDeductionInfoByEmpId
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const LoanTypeformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createLoanType = catchAsync(async (req, res) => {

  try {

 
    const LoanType = await LoanTypeformService.LoanTypeService.createLoanType(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: LoanType
    });

  } catch (error) {

    if (error?.parent?.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
});


const getAllLoanType = catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await LoanTypeformService.LoanTypeService.queryLoanTypes(filter, options, searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllLoanTypeInfoByEmpId = catchAsync(async (req, res) => {

  const Receipt = await LoanTypeformService.LoanTypeService.SP_getAllLoanTypeInfoByEmpId(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getLoanTypeById = catchAsync(async (req, res) => {

  const Receipt = await LoanTypeformService.LoanTypeService.getLoanTypeById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateLoanType = catchAsync(async (req, res) => {
  try {


    const Receipt = await LoanTypeformService.LoanTypeService.updateLoanTypeById(req.body.Id, req.body, req.user.Id);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: Receipt,
    });
  } catch (error) {

    if (error.parent.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry is not allowed!");
    }
    else {

      throw error;
    }
  }
});

const deleteLoanType = catchAsync(async (req, res) => {
  try {



    const Receipt = await LoanTypeformService.LoanTypeService.deleteLoanTypeById(req.body.Id);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: Receipt,
    });
  }
  catch (error) {

    if (error.parent.errno === 1451) {
      throw new ApiError(httpStatus.NOT_FOUND, "Record in another used!");
    }
    else {

      throw error;
    }
  }
});


module.exports = {
  createLoanType,
  getAllLoanType,
  getLoanTypeById,
  updateLoanType,
  deleteLoanType,
  SP_getAllLoanTypeInfoByEmpId
};

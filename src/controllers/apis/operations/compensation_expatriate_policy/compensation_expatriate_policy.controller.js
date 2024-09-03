const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const CompensationExpServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createCompensationExpatriate = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert CompensationExpatriate")
    console.log(req.body);
    const CompensationExpatriate = await CompensationExpServicePage.CompensationExpServicePage.createCompensationExpatriate(req, req.body);
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: CompensationExpatriate
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllCompensationExpatriate = catchAsync(async (req, res) => {
  console.log("get CompensationExpatriates");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await CompensationExpServicePage.CompensationExpServicePage.SP_getAllCompensationExpatriateInfo(filter, options,searchQuery,req.body.id,req.body.transactionType);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const SP_getAllCompensationExpatriateInfoByEmpId = catchAsync(async (req, res) => {
  console.log("CompensationExpatriate EmpId")
  console.log(req.body)
  const response = await CompensationExpServicePage.CompensationExpServicePage.SP_getAllCompensationExpatriateInfoByEmpId(req.body.id,req.body.transactionType);
 
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const getCompensationExpatriateById = catchAsync(async (req, res) => {
  console.log("compensation for update")
  console.log(req.body)
  const response = await CompensationExpServicePage.CompensationExpServicePage.getCompensationExpatriateById(req.body.Id);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const updateCompensationExpatriate = catchAsync(async (req, res) => {
  console.log(req.body);
  const response = await CompensationExpServicePage.CompensationExpServicePage.updateCompensationExpatriateById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const deleteCompensationExpatriate = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const response = await CompensationExpServicePage.CompensationExpServicePage.deleteCompensationExpatriateById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


module.exports = {
  createCompensationExpatriate,
  getAllCompensationExpatriate,
  getCompensationExpatriateById,
  updateCompensationExpatriate,
  deleteCompensationExpatriate,
  SP_getAllCompensationExpatriateInfoByEmpId
};

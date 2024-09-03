const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const Compensation_BeneftisformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createCompensation_Beneftis = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Compensation_Beneftis")
    console.log(req.body);
    const Compensation_Beneftis = await Compensation_BeneftisformService.CompensationBenefitsServicePage.createCompensation_Beneftis(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Compensation_Beneftis
    });

  } catch (error) {
    throw new ApiError("Duplicate entry not allowed", error);
  }
});

const getAllCompensation_Beneftis = catchAsync(async (req, res) => {
  console.log("get Compensation_Beneftis");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await Compensation_BeneftisformService.CompensationBenefitsServicePage.SP_getAllCompensation_BeneftisInfo(filter, options, searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const sp_GetAllEmpCompensation_BeneftisByPKId = catchAsync(async (req, res) => {
  console.log("academic controller empId", req.body)

  const result = await Compensation_BeneftisformService.CompensationBenefitsServicePage.sp_GetAllEmpCompensation_BeneftisByPKId(req.body.Id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getAllCompensation_BeneftisForDDL = catchAsync(async (req, res) => {

  const result = await Compensation_BeneftisformService.CompensationBenefitsServicePage.SP_getAllCompensation_BeneftisForDDL('null');
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const usp_GetAllCompensation_Earning_Deduction_ById = catchAsync(async (req, res) => {

  const result = await Compensation_BeneftisformService.CompensationBenefitsServicePage.usp_GetAllCompensation_Earning_Deduction_ById(req.body.Id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const getAll_earning_deduction_transaction_by_compensationPKId = catchAsync(async (req, res) => {
  console.log("mybody", req.body);
  const result = await Compensation_BeneftisformService.CompensationBenefitsServicePage.sp_getall_earning_deduction_transaction_bycompensatioPKID(req.body.Id, req.body.transactionType);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const update_compensation_heads_bulk = catchAsync(async (req, res) => {
  console.log("mybody", req.body.data);
  const result = await Compensation_BeneftisformService.CompensationBenefitsServicePage.update_compensation_heads_bulk(req.body.data.list, req.body.data.compensationId);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});



const getCompensation_BeneftisById = catchAsync(async (req, res) => {
  console.log("get id", req.body)

  const response = await Compensation_BeneftisformService.CompensationBenefitsServicePage.getCompensation_BeneftisById(req.body.Id);
  console.log("sky", response);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


const GetCompensationDetailsByAttr = catchAsync(async (req, res) => {
  console.log("get id", req.body)

  const response = await Compensation_BeneftisformService.CompensationBenefitsServicePage.GetCompensationDetailsByAttr(
    req.body.subsidiaryId,
    req.body.gradeId,
    req.body.employeeTypeId,
    req.body.currencyId
  );

  console.log("dude", response);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


const updateCompensation_Beneftis = catchAsync(async (req, res) => {
  console.log("update com", req.body);
  const response = await Compensation_BeneftisformService.CompensationBenefitsServicePage.updateCompensation_BeneftisById(req.body.Id, req.body, req.user.Id);
  console.log("res com", response);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});

const deleteCompensation_Beneftis = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body.Id)
  const response = await Compensation_BeneftisformService.CompensationBenefitsServicePage.deleteCompensation_BeneftisById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});


module.exports = {
  createCompensation_Beneftis,
  getAllCompensation_Beneftis,
  getCompensation_BeneftisById,
  updateCompensation_Beneftis,
  deleteCompensation_Beneftis,
  sp_GetAllEmpCompensation_BeneftisByPKId,
  getAllCompensation_BeneftisForDDL,
  getAll_earning_deduction_transaction_by_compensationPKId,
  update_compensation_heads_bulk,
  usp_GetAllCompensation_Earning_Deduction_ById,
  GetCompensationDetailsByAttr
};

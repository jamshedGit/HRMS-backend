const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const _final_settlement_policyformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");
const { finalSetllementPolicy } = require("../..");

const create_final_settlement_policy = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert _final_settlement_policy")
    console.log(req.body);
    const _final_settlement_policy = await _final_settlement_policyformService.FinalSettlementPolicy.createFinalSettlement(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: _final_settlement_policy
    });

  } catch (error) {
    console.log(error);        
  }
});


const usp_GetAllFinalSettlementsPolicy = catchAsync(async (req, res) => {
  console.log("usp_GetAllFinalSettlementsPolicy")
  console.log(req.body)
  const response = await _final_settlement_policyformService.FinalSettlementPolicy.usp_GetAllFinalSettlementsPolicy();
 
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, "response not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: response,
  });
});



const getAll_final_settlement_policys = catchAsync(async (req, res) => {
  console.log("get _final_settlement_policys");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await _final_settlement_policyformService.FinalSettlementPolicy.queryFinalSettlements(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const get_final_settlement_policyById = catchAsync(async (req, res) => {
  console.log("_final_settlement_policy Controller get_final_settlement_policyId")
  console.log(req.body)
  const Receipt = await _final_settlement_policyformService.FinalSettlementPolicy.getFinalSettlementById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const update_final_settlement_policy = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await _final_settlement_policyformService.FinalSettlementPolicy.updateFinalSettlementById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const delete_final_settlement_policy = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await _final_settlement_policyformService.FinalSettlementPolicy.deleteFinalSettlementById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


const usp_InsertFinalSettlementPolicy = catchAsync(async (req, res) => {
  console.log("bulk",req.body);
   const response = await _final_settlement_policyformService.FinalSettlementPolicy.usp_InsertFinalSettlementPolicy(req.body.data.earningObjList,req.body.data.body);
  
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
  create_final_settlement_policy,
  getAll_final_settlement_policys,
  get_final_settlement_policyById,
  update_final_settlement_policy,
  delete_final_settlement_policy,
  usp_InsertFinalSettlementPolicy,
  usp_GetAllFinalSettlementsPolicy
};

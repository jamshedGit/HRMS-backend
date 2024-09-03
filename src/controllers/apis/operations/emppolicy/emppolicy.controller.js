const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const EmpPolicyformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createEmpPolicy = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert EmpPolicy")
    console.log("req body",req.body);
    req.body.Id = req.body.Id;
    
    delete req.body.Id;
    const Bank = await EmpPolicyformService.EmpPolicyServicePage.createEmpPolicy(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllEmpPolicy = catchAsync(async (req, res) => {
  console.log("get EmpPolicy");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await EmpPolicyformService.EmpPolicyServicePage.queryEmpPolicy(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getEmpPolicyById = catchAsync(async (req, res) => {
  console.log("EmpPolicy Controller getbankId")
  console.log(req.body)
  const Receipt = await EmpPolicyformService.EmpPolicyServicePage.getEmpPolicyById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "EmpPolicy not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateEmpPolicy = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await EmpPolicyformService.EmpPolicyServicePage.updateEmpPolicyById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteEmpPolicy = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await EmpPolicyformService.EmpPolicyServicePage.deleteEmpPolicyById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createEmpPolicy,
  getAllEmpPolicy,
  getEmpPolicyById,
  updateEmpPolicy,
  deleteEmpPolicy
};

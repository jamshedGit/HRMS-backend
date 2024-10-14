const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const _Payroll_Process_PolicyServicePage = require("../../../../services/index");

const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const create_Payroll_Process_Policy = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert _Payroll_Process_Policy")
    console.log(req.body);
    const _Payroll_Process_Policy = await _Payroll_Process_PolicyServicePage._Payroll_Process_PolicyServicePage.create_Payroll_Process_Policy(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: _Payroll_Process_Policy
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAll_Payroll_Process_Policy = catchAsync(async (req, res) => {
  console.log("get _Payroll_Process_Policys");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await _Payroll_Process_PolicyServicePage._Payroll_Process_PolicyServicePage.query_Payroll_Process_Policys(filter, options,searchQuery);
  console.log("resp2",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const get_Payroll_Process_PolicyById = catchAsync(async (req, res) => {
  console.log("_Payroll_Process_Policy Controller get_Payroll_Process_PolicyId")
  console.log(req.body)
  const Receipt = await _Payroll_Process_PolicyServicePage._Payroll_Process_PolicyServicePage.get_Payroll_Process_PolicyById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const update_Payroll_Process_Policy = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await _Payroll_Process_PolicyServicePage._Payroll_Process_PolicyServicePage.update_Payroll_Process_PolicyById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const delete_Payroll_Process_Policy = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await _Payroll_Process_PolicyServicePage._Payroll_Process_PolicyServicePage.delete_Payroll_Process_PolicyById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  create_Payroll_Process_Policy,
  getAll_Payroll_Process_Policy,
  get_Payroll_Process_PolicyById,
  update_Payroll_Process_Policy,
  delete_Payroll_Process_Policy
};

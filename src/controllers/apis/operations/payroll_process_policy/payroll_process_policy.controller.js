const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const PayrollProcessPolicy = require("../../../../services/index");

const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const create_Payroll_Process_Policy = catchAsync(async (req, res) => {
  try {
    const _Payroll_Process_Policy = await PayrollProcessPolicy.PayrollProcessPolicy.createPayrollPolicy(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: _Payroll_Process_Policy
    });
  }  catch (error) {
   
    if (error.parent.errno === 1062) {
     throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
   }
   else {
     throw error;
   }
 }
});

const getAll_Payroll_Process_Policy = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await PayrollProcessPolicy.PayrollProcessPolicy.queryPayrollPolicy(filter, options,searchQuery);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const get_Payroll_Process_PolicyById = catchAsync(async (req, res) => {
  const Receipt = await PayrollProcessPolicy.PayrollProcessPolicy.getPayrollPolicyById(req.body.Id);
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
  const Receipt = await PayrollProcessPolicy.PayrollProcessPolicy.updatePayrollPolicyById(req.body.body.Id, req.body.body, req.user.Id,req.body);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const delete_Payroll_Process_Policy = catchAsync(async (req, res) => {
  const Receipt = await PayrollProcessPolicy.PayrollProcessPolicy.deletePayrollPolicyById(req.body.Id);
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

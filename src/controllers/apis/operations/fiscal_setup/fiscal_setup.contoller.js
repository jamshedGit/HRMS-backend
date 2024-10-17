const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const FiscalSetupServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const create_FiscalSetup = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert _FiscalSetup")
    console.log(req.body);
    const FiscalSetup = await FiscalSetupServicePage.FiscalSetupServicePage.createFiscalSetup(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: FiscalSetup
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAll_FiscalSetup = catchAsync(async (req, res) => {
  console.log("get _FiscalSetups");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await FiscalSetupServicePage.FiscalSetupServicePage.queryFiscalSetups(filter, options,searchQuery);
  console.log("resp2",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const get_FiscalSetupById = catchAsync(async (req, res) => {
  console.log("_FiscalSetup Controller get_FiscalSetupId")
  console.log(req.body)
  const Receipt = await FiscalSetupServicePage.FiscalSetupServicePage.getFiscalSetupById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const update_FiscalSetup = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await FiscalSetupServicePage.FiscalSetupServicePage.updateFiscalSetupById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const delete_FiscalSetup = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await FiscalSetupServicePage.FiscalSetupServicePage.deleteFiscalSetupById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  create_FiscalSetup,
  getAll_FiscalSetup,
  get_FiscalSetupById,
  update_FiscalSetup,
  delete_FiscalSetup
};

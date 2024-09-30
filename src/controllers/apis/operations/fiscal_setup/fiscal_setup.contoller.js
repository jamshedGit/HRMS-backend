const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const FiscalSetupServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createFiscalSetup = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert FiscalSetup")
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

const getAllFiscalSetup = catchAsync(async (req, res) => {
  console.log("get FiscalSetups");
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

const getFiscalSetupById = catchAsync(async (req, res) => {
  console.log("FiscalSetup Controller getFiscalSetupId")
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

const updateFiscalSetup = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await FiscalSetupServicePage.FiscalSetupServicePage.updateFiscalSetupById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteFiscalSetup = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await FiscalSetupServicePage.FiscalSetupServicePage.deleteFiscalSetupById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createFiscalSetup,
  getAllFiscalSetup,
  getFiscalSetupById,
  updateFiscalSetup,
  deleteFiscalSetup
};

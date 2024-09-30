const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const TaxSetupServicePage = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createTaxSetup = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert TaxSetup")
    console.log(req.body);
    const TaxSetup = await TaxSetupServicePage.TaxSetupServicePage.createTaxSetup(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: TaxSetup
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllTaxSetup = catchAsync(async (req, res) => {
  console.log("get TaxSetups");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await TaxSetupServicePage.TaxSetupServicePage.queryTaxSetups(filter, options,searchQuery);
  console.log("resp2",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getTaxSetupById = catchAsync(async (req, res) => {
  console.log("TaxSetup Controller getTaxSetupId")
  console.log(req.body)
  const Receipt = await TaxSetupServicePage.TaxSetupServicePage.getTaxSetupById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateTaxSetup = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await TaxSetupServicePage.TaxSetupServicePage.updateTaxSetupById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteTaxSetup = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await TaxSetupServicePage.TaxSetupServicePage.deleteTaxSetupById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createTaxSetup,
  getAllTaxSetup,
  getTaxSetupById,
  updateTaxSetup,
  deleteTaxSetup
};

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
  
  try {


    const TaxSetup = await TaxSetupServicePage.TaxSetupServicePage.createTaxSetup(req, req.body);

    if(TaxSetup?.status=="error"){

      res.status(HttpStatusCodes?.INTERNAL_SERVER_ERROR).send({
        code: HttpStatusCodes?.INTERNAL_SERVER_ERROR,
        message:TaxSetup?.message,
        error: TaxSetup?.error || 'An unexpected error occurred',
      });
      
  
    }

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: TaxSetup
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

const getAllTaxSetup = catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await TaxSetupServicePage.TaxSetupServicePage.queryTaxSetups(filter, options, searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getTaxSetupById = catchAsync(async (req, res) => {
 

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

  const Receipt = await TaxSetupServicePage.TaxSetupServicePage.updateTaxSetupById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteTaxSetup = catchAsync(async (req, res) => {
  try {



    const Receipt = await TaxSetupServicePage.TaxSetupServicePage.deleteTaxSetupById(req.body.Id);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: Receipt,
    });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record is in another used!");
  }

});


module.exports = {
  createTaxSetup,
  getAllTaxSetup,
  getTaxSetupById,
  updateTaxSetup,
  deleteTaxSetup
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const loan_management_configurationService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createloan_management_configuration = catchAsync(async (req, res) => {

  try {


    const loan_management_configuration = await loan_management_configurationService.loan_management_configurationService.createloan_management_configuration(req, req.body);

   

    if(loan_management_configuration.status=="error"){

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message:loan_management_configuration.message,
        error: loan_management_configuration.error || 'An unexpected error occurred',
      });
      
  
    }
    else{
        
     res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: loan_management_configuration
    });
  }

  } catch (error) {
       
  }
});




const getAllloan_management_configuration= catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
 
  const result = await loan_management_configurationService.loan_management_configurationService.queryloan_management_configuration(req,filter, options,searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getloan_management_configurationById = catchAsync(async (req, res) => {


  const Receipt = await loan_management_configurationService.loan_management_configurationService.getloan_management_configurationById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateloan_management_configuration = catchAsync(async (req, res) => {

  const loan_management_configuration = await loan_management_configurationService.loan_management_configurationService.updateloan_management_configurationById(req.body.Id, req.body, req.user.Id);
  
  
  if(loan_management_configuration?.status=="error"){

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message:loan_management_configuration.message,
      error: loan_management_configuration.error || 'An unexpected error occurred',
    });
    

  }
  else{
      
   res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: loan_management_configuration
  });
}
  
  
  // res.send({
  //   code: HttpStatusCodes.OK,
  //   message: HttpResponseMessages.OK,
  //   data: loan_management_configuration,
  // });
});

const deleteloan_management_configuration = catchAsync(async (req, res) => {

  const Receipt = await loan_management_configurationService.loan_management_configurationService.deleteloan_management_configurationById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getAllLoanType = catchAsync(async (req, res) => {
  
  const result = await loan_management_configurationService.loan_management_configurationService.queryLoanTypes();

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const deleteLoanDetailById = catchAsync(async (req, res) => {

  const Receipt = await loan_management_configurationService.loan_management_configurationService.deleteLoanDetailById(req.body);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

module.exports = {
  createloan_management_configuration,
  getAllloan_management_configuration,
  getloan_management_configurationById,
  updateloan_management_configuration,
  deleteloan_management_configuration,
  getAllLoanType,deleteLoanDetailById,
 
};

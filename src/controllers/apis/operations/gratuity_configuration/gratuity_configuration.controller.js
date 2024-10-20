const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const {Gratuity_configurationService} = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const creategratuity_configuration = catchAsync(async (req, res) => {

  try {


    const gratuity_configuration = await Gratuity_configurationService.creategratuity_configuration(req, req.body);

    if (gratuity_configuration?.status && gratuity_configuration.status === "error") {

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message:gratuity_configuration.message,
        error: gratuity_configuration.error || 'An unexpected error occurred',
      });
      
  
    }
    else{
      console.log("created")
        
     res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: gratuity_configuration
    });
  }

  } catch (error) {
    console.log(error);        
  }
});


const getAllgratuity_configuration= catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  console.log("searchQuery",searchQuery)
  const result = await Gratuity_configurationService.querygratuity_configuration(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getgratuity_configurationById = catchAsync(async (req, res) => {
  console.log("loan_management_configuration Controller getloan_management_configurationId")
  console.log(req.body)
  const Receipt = await Gratuity_configurationService.getgratuity_configurationById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updategratuity_configuration = catchAsync(async (req, res) => {
  console.log(req.body);
  const loan_management_configuration = await loan_management_configurationService.loan_management_configurationService.updateloan_management_configurationById(req.body.Id, req.body, req.user.Id);
  
  
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
  
  
  // res.send({
  //   code: HttpStatusCodes.OK,
  //   message: HttpResponseMessages.OK,
  //   data: loan_management_configuration,
  // });
});

const deletegratuity_configuration = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await loan_management_configurationService.loan_management_configurationService.deleteloan_management_configurationById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});



module.exports = {
    creategratuity_configuration,
    getAllgratuity_configuration,
  getgratuity_configurationById,
  updategratuity_configuration,
  deletegratuity_configuration,
 
};

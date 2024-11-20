const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const {Payroll_ProcessService} = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createPayroll_Process = catchAsync(async (req, res) => {

  try {

    console.log("createPayroll_Process1")
    const Payroll_Process = await Payroll_ProcessService.createPayroll_Process(req, req.body);

    if (Payroll_Process?.status && Payroll_Process.status === "error") {

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message:Payroll_Process.message,
        error: Payroll_Process.error || 'An unexpected error occurred',
      });
      
  
    }
    else{
  
      
     res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message:Payroll_Process.message,
      data: Payroll_Process
    });
  }

  } catch (error) {
    throw error     
  }
});


const getAllPayroll_Process= catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';

  const result = await Payroll_ProcessService.queryPayroll_Process(filter, options,searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getPayroll_ProcessById = catchAsync(async (req, res) => {

  const Receipt = await Payroll_ProcessService.getPayroll_ProcessById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updatePayroll_Process = catchAsync(async (req, res) => {

  const Payroll_Process = await Payroll_ProcessService.updatePayroll_ProcessById(req.body.Id, req.body, req.user.Id);
  
  
  if(Payroll_Process.status=="error"){

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message:Payroll_Process.message,
      error: Payroll_Process.error || 'An unexpected error occurred',
    });
    

  }
  else{
      
   res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: Payroll_Process
  });
}
  
  
  // res.send({
  //   code: HttpStatusCodes.OK,
  //   message: HttpResponseMessages.OK,
  //   data: loan_management_configuration,
  // });
});

const deletePayroll_Process = catchAsync(async (req, res) => {

  const Receipt = await Payroll_ProcessService.deletePayroll_ProcessById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});



module.exports = {
    createPayroll_Process,
    getAllPayroll_Process,
  getPayroll_ProcessById,
  updatePayroll_Process,
  deletePayroll_Process,
 
};

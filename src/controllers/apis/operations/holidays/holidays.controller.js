const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const {HolidaysService} = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createholidays = catchAsync(async (req, res) => {

  try {


    const holidays = await HolidaysService.createholidays(req, req.body);

    if (holidays?.status && holidays.status === "error") {

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message:holidays.message,
        error: holidays.error || 'An unexpected error occurred',
      });
      
  
    }
    else{
  
      
     res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message:holidays.message,
      data: holidays
    });
  }

  } catch (error) {
    throw error     
  }
});


const getAllholidays= catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';

  const result = await HolidaysService.queryholidays(req,filter, options,searchQuery);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getholidaysById = catchAsync(async (req, res) => {

  const Receipt = await HolidaysService.getholidaysById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateholidays = catchAsync(async (req, res) => {

  const holidays = await HolidaysService.updateholidaysById(req.body.Id, req.body, req.user.Id);
  
  
  if(holidays.status=="error"){

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message:holidays.message,
      error: holidays.error || 'An unexpected error occurred',
    });
    

  }
  else{
      
   res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: holidays
  });
}
  
  
  // res.send({
  //   code: HttpStatusCodes.OK,
  //   message: HttpResponseMessages.OK,
  //   data: loan_management_configuration,
  // });
});

const deleteholidays = catchAsync(async (req, res) => {

  const Receipt = await HolidaysService.deleteholidaysById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});



module.exports = {
    createholidays,
    getAllholidays,
  getholidaysById,
  updateholidays,
  deleteholidays,
 
};

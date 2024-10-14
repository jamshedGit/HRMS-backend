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
  // console.log("reqested User", req.user.id);
  try {


    const loan_management_configuration = await loan_management_configurationService.loan_management_configurationService.createloan_management_configuration(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: loan_management_configuration
    });

  } catch (error) {
    console.log(error);        
  }
});


// const createloan_management_configuration = catchAsync(async (req, res) => {
//   try {
//     // Create the loan management configuration
//     const loan_management_configuration = await loan_management_configurationService.loan_management_configurationService.createloan_management_configuration(req, req.body);

 
//     if (req.body.details && Array.isArray(req.body.details)) {
//       const loanDetails = req.body.details.map(detail => ({
//         ...detail,
//         loan_management_configurationId: loan_management_configuration.Id 
//       }));

//       // Save the loan management details
//       await Loan_management_detail.bulkCreate(loanDetails);
//     }

//     res.status(httpStatus.CREATED).send({
//       code: HttpStatusCodes.CREATED,
//       message: HttpResponseMessages.CREATED,
//       data: loan_management_configuration
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
//       code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
//       message: HttpResponseMessages.INTERNAL_SERVER_ERROR,
//     });
//   }
// });




const getAllloan_management_configuration= catchAsync(async (req, res) => {
  console.log("get loan_management_configurations");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  console.log("searchQuery",searchQuery)
  const result = await loan_management_configurationService.loan_management_configurationService.queryloan_management_configuration(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getloan_management_configurationById = catchAsync(async (req, res) => {
  console.log("loan_management_configuration Controller getloan_management_configurationId")
  console.log(req.body)
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
  console.log(req.body);
  const Receipt = await loan_management_configurationService.loan_management_configurationService.updateloan_management_configurationById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteloan_management_configuration = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await loan_management_configurationService.loan_management_configurationService.deleteloan_management_configurationById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getCurrentMonth = catchAsync(async (req, res) => {
  console.log("get current month");
  // const obj = {};
  // const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  // const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  // const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await loan_management_configurationService.loan_management_configurationService.getCurrentMonth();
  console.log("resp2",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

module.exports = {
  createloan_management_configuration,
  getAllloan_management_configuration,
  getloan_management_configurationById,
  updateloan_management_configuration,
  deleteloan_management_configuration,
  getCurrentMonth
};

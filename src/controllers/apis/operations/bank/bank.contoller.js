const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const bankformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createBank = catchAsync(async (req, res) => {

  try {

    const Bank = await bankformService.bankFormService.createBank(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  } catch (error) {

    if (error.parent.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
});

const getAllBanks = catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await bankformService.bankFormService.queryBanks(filter, options, searchQuery);
 
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getBankById = catchAsync(async (req, res) => {

  const Receipt = await bankformService.bankFormService.getBankById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateBank = catchAsync(async (req, res) => {

  try {

    const bank = await bankformService.bankFormService.updateBankById(req.body.Id, req.body, req.user.Id);
    
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: bank,
    });

  } catch (error) {
   
    if (error.parent.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
});

const deleteBank = catchAsync(async (req, res) => {
  try {

  const Receipt = await bankformService.bankFormService.deleteBankById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });

}catch (error) {

    if (error.parent.errno === 1451) {
      throw new ApiError(httpStatus.NOT_FOUND, HttpResponseMessages.ASSOCIATED_RECORD);
    }
    else {

      throw error;
    }
  }
});





module.exports = {
  createBank,
  getAllBanks,
  getBankById,
  updateBank,
  deleteBank
};

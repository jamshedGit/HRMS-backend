const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const branchformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createBranch = catchAsync(async (req, res) => {

  try {

 
    req.body.Id = req.body.Id;
    
    delete req.body.Id;

    
    const Bank = await branchformService.branchFormService.createBranch(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  }  catch (error) {
   
    if (error.parent.errno === 1062) {
     throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
   }
   else {
    
     throw error;
   }
 }
});

const getAllBranch = catchAsync(async (req, res) => {

  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await branchformService.branchFormService.queryBranch(filter, options,searchQuery);
 
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getBranchById = catchAsync(async (req, res) => {
 
 
  const Receipt = await branchformService.branchFormService.getBranchById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateBranch = catchAsync(async (req, res) => {

  try {
    
  

  const Receipt = await branchformService.branchFormService.updateBranchById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
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

const deleteBranch = catchAsync(async (req, res) => {
 
  const Receipt = await branchformService.branchFormService.deleteBranchById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createBranch,
  getAllBranch,
  getBranchById,
  updateBranch,
  deleteBranch
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const tax_slabformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createtax_slab = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {


    const tax_slab = await tax_slabformService.tax_slabFormService.createtax_slab(req, req.body);

    if(tax_slab.status=="error"){

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message:tax_slab.message,
        error: tax_slab.error || 'An unexpected error occurred',
      });
      
  
    }
    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: tax_slab
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAlltax_slabs = catchAsync(async (req, res) => {
  console.log("get tax_slabs tax_slab body");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  console.log("searchQuery",searchQuery)
  const result = await tax_slabformService.tax_slabFormService.querytax_slab(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const gettax_slabById = catchAsync(async (req, res) => {
  console.log("tax_slab Controller gettax_slabId")
  console.log(req.body)
  const Receipt = await tax_slabformService.tax_slabFormService.gettax_slabById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updatetax_slab = catchAsync(async (req, res) => {
  console.log("tax_slab body",req.body);
  const Receipt = await tax_slabformService.tax_slabFormService.updatetax_slabById(req.body.Id, req.body, req.user.Id);
  
  console.log("recipt tax_slab",Receipt)

  if(Receipt.status=="error"){

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
      code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message:Receipt.message,
      error: Receipt.error || 'An unexpected error occurred',
    });
    

  }
  else{
      
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt.message,
  });

  }


  
});

const deletetax_slab = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await tax_slabformService.tax_slabFormService.deletetax_slabById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createtax_slab,
  getAlltax_slabs,
  gettax_slabById,
  updatetax_slab,
  deletetax_slab
};

const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const AcademicformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createAcademic = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Academic")
    console.log(req.body);
    const Academic = await AcademicformService.AcademicServicePage.createAcademic(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Academic
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllAcademics = catchAsync(async (req, res) => {
  console.log("get Academic",req.body);
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await AcademicformService.AcademicServicePage.SP_getAllAcademicsInfo(filter, options,searchQuery,req.body.Id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getAcademicById = catchAsync(async (req, res) => {
  console.log("Academic Controller getAcademicId")
  console.log(req.body)
  const Receipt = await AcademicformService.AcademicServicePage.getAcademicById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getAllAcademicByEmpId = catchAsync(async (req, res) => {
  console.log("Academic Controller getAcademicId")
  console.log(req.body)
  const Receipt = await AcademicformService.AcademicServicePage.SP_getAllAcademicsInfoByEmpId(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateAcademic = catchAsync(async (req, res) => {
  console.log("JS",req.body);
  const Receipt = await AcademicformService.AcademicServicePage.updateAcademicById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteAcademic = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await AcademicformService.AcademicServicePage.deleteAcademicById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createAcademic,
  getAllAcademics,
  getAcademicById,
  updateAcademic,
  deleteAcademic,
  getAllAcademicByEmpId
};

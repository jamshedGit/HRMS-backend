const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const ExperienceformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createExperience = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Experience")
    console.log(req.body);
    const Experience = await ExperienceformService.ExperienceServicePage.createExperience(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Experience
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllExperience = catchAsync(async (req, res) => {
  console.log("get Experience",req.body);
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await ExperienceformService.ExperienceServicePage.SP_getAllExperiencesInfo(filter, options,searchQuery,req.body.id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const getExperienceById = catchAsync(async (req, res) => {
  console.log("Experience Controller getExperienceId")
  console.log(req.body)
  const Receipt = await ExperienceformService.ExperienceServicePage.getExperienceById(req.body.Id);
  console.log("xxx",Receipt);  
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getEmployeeExperienceByEmpId = catchAsync(async (req, res) => {
  console.log("Experience Controller getExperienceId")
  console.log(req.body)
  const list = await ExperienceformService.ExperienceServicePage.SP_getAllExperiencesInfoByEmpId(req.body.Id);
  console.log("xxx",list);  
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: list,
  });
});

const updateExperience = catchAsync(async (req, res) => {
  console.log("JS",req.body);
  const Receipt = await ExperienceformService.ExperienceServicePage.updateExperienceById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteExperience = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await ExperienceformService.ExperienceServicePage.deleteExperienceById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createExperience,
  getAllExperience,
  getExperienceById,
  updateExperience,
  deleteExperience,
  getEmployeeExperienceByEmpId
};

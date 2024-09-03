const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const SkillsformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createSkills = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Skills")
    console.log(req.body);
    const Skills = await SkillsformService.SKillsServicePage.createSkills(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Skills
    });

  } catch (error) {
    console.log(error);        
  }
});

const getAllSkills = catchAsync(async (req, res) => {
  console.log("get Skillss");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const result = await SkillsformService.SKillsServicePage.SP_getAllSkillsInfo(filter, options,searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const sp_GetAllEmpSkillsByEmpId = catchAsync(async (req, res) => {
  console.log("academic controller empId",req.body)

  const result = await SkillsformService.SKillsServicePage.SP_getAllSkillsInfoByEmpId(req.body.Id);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const getSkillsById = catchAsync(async (req, res) => {
  console.log("Skills Controller getSkillsId")
  console.log(req.body)
  const Receipt = await SkillsformService.SKillsServicePage.getSkillsById(req.body.id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const updateSkills = catchAsync(async (req, res) => {
  console.log(req.body);
  const Receipt = await SkillsformService.SKillsServicePage.updateSkillsById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const deleteSkills = catchAsync(async (req, res) => {
  console.log("req.body.Id " ,req.body.Id)
  const Receipt = await SkillsformService.SKillsServicePage.deleteSkillsById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


module.exports = {
  createSkills,
  getAllSkills,
  getSkillsById,
  updateSkills,
  deleteSkills,
  sp_GetAllEmpSkillsByEmpId
};

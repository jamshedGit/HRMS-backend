const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const Emp_profileformService = require("../../../../services/index");


const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const imageUpload = async (req, res) => {
  console.log(':auyYyY:::', req.file)
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  // Generate the URL for the uploaded image (assuming a public uploads folder)
  const imageUrl = `http://localhost:${3000}/uploads/${req.file.filename}`;

  res.json({ message: 'Image uploaded successfully!', imageUrl });
};

const createEmp_profile = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  try {

    console.log("insert Emp_profile")
    console.log("req body", req.body);
    req.body.Id = req.body.Id;
   
   // req.body.profile_image=req.file.originalname
    delete req.body.Id;
    const Bank = await Emp_profileformService.EmpProfileServicePage.createEmp_profile(req, req.body);

    res.status(httpStatus.CREATED).send({
      code: HttpStatusCodes.CREATED,
      message: HttpResponseMessages.CREATED,
      data: Bank
    });

  } catch (error) {
    console.log(error);
  }
});

const getAllEmp_profile = catchAsync(async (req, res) => {
  console.log("get Emp_profile");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await Emp_profileformService.EmpProfileServicePage.queryEmp_profile(filter, options, searchQuery);
  console.log(result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});


const getAllContactInfo = catchAsync(async (req, res) => {
  console.log("get contact");
  const obj = {};
  const filter = obj;
  // const options = pick(req.body, ["sortBy", "limit", "page"]);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  //const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
  const result = await Emp_profileformService.EmpProfileServicePage.queryContactInfo();
  console.log("result contact",result);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getEmp_profileById = catchAsync(async (req, res) => {
  console.log("Emp_profile Controller")
  console.log(req.body)
  const Receipt = await Emp_profileformService.EmpProfileServicePage.getEmp_profileById(req.body.Id);
  if (!Receipt) {
    throw new ApiError(httpStatus.NOT_FOUND, "Emp_profile not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getContactInfoByEmployeeId = catchAsync(async (req, res) => {
  console.log("get contact by empId")
  console.log(req.body)
  const list = await Emp_profileformService.EmpProfileServicePage.getContactInfoByEmployeeId(req.body.Id);
  console.log("mylist",list)
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, "Emp_profile not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data:list,
  });
});

const updateEmp_profile = catchAsync(async (req, res) => {
 // req.body.profile_image = req.file.filename
  console.log("update emp",req.body);
  const Receipt = await Emp_profileformService.EmpProfileServicePage.updateEmp_profileById(req.body.Id, req.body, req.user.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});


const updateContactById = catchAsync(async (req, res) => {
  // req.body.profile_image = req.file.filename
   console.log("updateZZZ",req.body);
   const Receipt = await Emp_profileformService.EmpProfileServicePage.updateContactById(req.body.Id, req.body, req.user.Id);
   res.send({
     code: HttpStatusCodes.OK,
     message: HttpResponseMessages.OK,
     data: Receipt,
   });
 });
 

 const usp_GetAllEmployeeProfileDetails = catchAsync(async (req, res) => {
   console.log("get profile",req.body);
   const objResult = await Emp_profileformService.EmpProfileServicePage.usp_GetAllEmployeeProfileDetails(req.body.employeeId);
   res.send({
     code: HttpStatusCodes.OK,
     message: HttpResponseMessages.OK,
     data: objResult,
   });
 });
 

const deleteEmp_profile = catchAsync(async (req, res) => {
  console.log("req.body.Id ", req.body.Id)
  const Receipt = await Emp_profileformService.EmpProfileServicePage.deleteEmp_profileById(req.body.Id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});

const getProfileView = catchAsync(async (req, res) => {
  const Receipt = await Emp_profileformService.EmpProfileServicePage.getProfileView(req.params.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Receipt,
  });
});



module.exports = {
  createEmp_profile,
  getAllEmp_profile,
  getEmp_profileById,
  updateEmp_profile,
  deleteEmp_profile,
  imageUpload,
  getAllContactInfo,
  getContactInfoByEmployeeId,
  updateContactById,
  usp_GetAllEmployeeProfileDetails,
  getProfileView
};

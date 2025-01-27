const httpStatus = require('http-status');
const pick = require("../../../../utils/pick");
const ApiError = require('../../../../utils/ApiError');
const catchAsync = require('../../../../utils/catchAsync');
const { UserService } =  require("../../../../services/index");
const { HttpStatusCodes, HttpResponseMessages } = require('../../../../utils/constants');


const createUser = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body, req.user.id);

  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: user,
  });
});

const getAllUser= catchAsync(async (req, res) => {

    const obj = {};
    const filter = obj;
    // const options = pick(req.body, ["sortBy", "limit", "page"]);
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
    const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
 
    const result = await UserService.queryUser(filter, options,searchQuery,req.user.Id);
  
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: result,
    });
  });






const getUser = catchAsync(async (req, res) => {
  const user = await UserService.getUserById(req.body.Id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  // const user = await UserService.updateUserById(req.body.id, req.body, req.user.id);
  const user = await UserService.updateUserById(req.body.Id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  // req.body.isActive = false;
  const user = await UserService.deleteUserById(req.body.Id);

  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: user
  });
});

const getUserRoleAccess = catchAsync(async (req, res) => {
  const roleData = await UserService.getUserRoleAccess(req.body.roleId, req.body.resourceSlug, req.body.rightSlug);
  res.send(roleData);
});

const getUserAccessForMiddleware = catchAsync(async (req, res) => {
  const roleData = await UserService.getUserAccessForMiddleware(req.roleId, req.slug);
  res.send(roleData);
});

const getUserByToken = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});



// const updatePasswordMobile = catchAsync(async (req, res) => {
//   const user = await UserService.updatePasswordMobile(req.body.email);
//   res.send({
//     code: HttpStatusCodes.OK,
//     message: HttpResponseMessages.OK,
//     data: user,
//   });
// });

// const allResetPassUsers = catchAsync(async (req, res) => {
//   const obj = { isDeleted: false, isResetPassword: 1 };
//   req.user.dealerId ? Object.assign(obj, { dealerId: req.user.dealerId }) : null;
//   const filter = obj;
//   console.log(req);
//   const options = pick(req.body, ['sortBy', 'limit', 'page']);
//   const result = await UserService.allResetPassUsers(filter, options);
//   res.send({
//     code: HttpStatusCodes.OK,
//     message: HttpResponseMessages.OK,
//     data: result,
//   });
// });

// const createNewPassword = catchAsync(async (req, res) => {
//   const user = { password: req.body.newPassword, isResetPassword: 0, updatedBy: req.user._id };
//   const userUpdatePassword = await UserService.createNewPassword(req.body._id, user);
//   res.status(httpStatus.CREATED).send({
//     code: HttpStatusCodes.CREATED,
//     message: HttpResponseMessages.CREATED,
//     data: userUpdatePassword,
//   });
// });

// const adminResetPassword = catchAsync(async (req, res) => {
//   const user = { password: req.body.newPassword, updatedBy: req.user._id };
//   const userUpdatePassword = await UserService.adminResetPassword(req.user._id, req.body.oldPassword, user);
//   res.status(httpStatus.OK).send({
//     code: HttpStatusCodes.OK,
//     message: HttpResponseMessages.CREATED,
//     data: userUpdatePassword,
//   });
// });

module.exports = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
//   getUserRoleAccess,
//   getUserAccessForMiddleware,
//   getUserByToken,
  // updatePasswordMobile,
  // allResetPassUser,
  // createNewPassword,
  // adminResetPassword,
};

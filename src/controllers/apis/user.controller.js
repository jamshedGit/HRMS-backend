const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { userService } = require('../../services');
const { HttpStatusCodes, HttpResponseMessages } = require('../../utils/constants');
const { tokenTypes } = require('../../config/tokens');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req.user.id);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: user,
  });
});

const getUsers = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['firstName', 'lastName', 'userName', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // req.user.dealerId ? Object.assign(obj, { dealerId: req.user.dealerId }) : null;
  const obj = {};
  req.user.dealerId ? Object.assign(obj, { dealerId: req.user.dealerId }) : null;
  const filter = obj;
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const startDate = req.body.filter.startDate? req.body.filter.startDate : '';
  const endDate = req.body.filter.endDate? req.body.filter.endDate : '';
  // const options = pick(req.body, ['sortBy', 'limit', 'page']);
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const result = await userService.queryUsers(filter, options, searchQuery, startDate, endDate);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.id);
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
  const user = await userService.updateUserByIdForUserManagement(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  // req.body.isActive = false;
  const user = await userService.deleteUserById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: user,
  });
});

const getUserRoleAccess = catchAsync(async (req, res) => {
  const roleData = await userService.getUserRoleAccess(req.body.roleId, req.body.resourceSlug, req.body.rightSlug);
  res.send(roleData);
});

const getUserAccessForMiddleware = catchAsync(async (req, res) => {
  const roleData = await userService.getUserAccessForMiddleware(req.roleId, req.slug);
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
//   const user = await userService.updatePasswordMobile(req.body.email);
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
//   const result = await userService.allResetPassUsers(filter, options);
//   res.send({
//     code: HttpStatusCodes.OK,
//     message: HttpResponseMessages.OK,
//     data: result,
//   });
// });

// const createNewPassword = catchAsync(async (req, res) => {
//   const user = { password: req.body.newPassword, isResetPassword: 0, updatedBy: req.user._id };
//   const userUpdatePassword = await userService.createNewPassword(req.body._id, user);
//   res.status(httpStatus.CREATED).send({
//     code: HttpStatusCodes.CREATED,
//     message: HttpResponseMessages.CREATED,
//     data: userUpdatePassword,
//   });
// });

// const adminResetPassword = catchAsync(async (req, res) => {
//   const user = { password: req.body.newPassword, updatedBy: req.user._id };
//   const userUpdatePassword = await userService.adminResetPassword(req.user._id, req.body.oldPassword, user);
//   res.status(httpStatus.OK).send({
//     code: HttpStatusCodes.OK,
//     message: HttpResponseMessages.CREATED,
//     data: userUpdatePassword,
//   });
// });

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserRoleAccess,
  getUserAccessForMiddleware,
  getUserByToken,
  // updatePasswordMobile,
  // allResetPassUsers,
  // createNewPassword,
  // adminResetPassword,
};

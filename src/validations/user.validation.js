const { allow } = require('joi');
const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    id: Joi.disallow(),
    email: Joi.string().required().email(),
    phNo:Joi.string().allow(),
    cnic:Joi.string().allow(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    status: Joi.string().required(),
    roleId: Joi.number().integer().required(),
    centerId: Joi.number().integer().required(),
    subCenterId: Joi.number().integer().required(),
    countryId: Joi.number().integer().required(),
    cityId: Joi.number().integer().required(),
  }),
};

const getUsers = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    filter: Joi.allow(),
    sortOrder: Joi.string(),
    pageSize: Joi.number().integer(),
    pageNumber: Joi.number().integer(),
    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

const getUser = {
  body: Joi.object().keys({
    id: Joi.allow(),
  }),
};

// const getUserByCenter = {
//   body: Joi.object().keys({
//     id: Joi.allow(),
//   }),
// };

const updateUser = {
  query: Joi.disallow(),
  params: Joi.disallow(),    
  body: Joi.object()
    .keys({
      id: Joi.allow(),
      email: Joi.string().email(),
      phNo:Joi.string().allow(),
      cnic:Joi.string().allow(),
      // password: Joi.string().custom(password),
      password: Joi.disallow(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      status: Joi.string().allow(),
      roleId: Joi.number().integer().allow(),
      centerId: Joi.number().integer().allow(),
      subCenterId: Joi.number().integer().allow(),
      countryId: Joi.number().integer().allow(),
      cityId: Joi.number().integer().allow(),
    })
    .min(1),
};

const deleteUser = {
  body: Joi.object().keys({
    id: Joi.number().integer()
  }),
};

// const getUserRoleAccess = {
//   params: Joi.object().keys({
//     roleId: Joi.string().custom(objectId),
//   }),
// };

const getUserByToken = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

// const updatePasswordMobile = {
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//   }),
// };

// const allResetPassUsers = {
//   body: Joi.object().keys({
//     sortBy: Joi.string(),
//     limit: Joi.number().integer(),
//     page: Joi.number().integer(),
//   }),
// };

// const createNewPassword = {
//   body: Joi.object().keys({
//     _id: Joi.required().custom(objectId),
//     newPassword: Joi.string().required().custom(password),
//   }),
// };

// const adminResetPassword = {
//   body: Joi.object().keys({
//     oldPassword: Joi.string().required().custom(password),
//     newPassword: Joi.string().required().custom(password),
//   }),
// };

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  // getUserRoleAccess,
  getUserByToken,
  // updatePasswordMobile,
  // allResetPassUsers,
  // createNewPassword,
  // adminResetPassword,
};

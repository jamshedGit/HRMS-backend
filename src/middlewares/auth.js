const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
// const { roleRights } = require('../config/roles');
const { userService } = require('../services');
const { getRouteSlugs } = require('../utils/common');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  // console.log("err",err)
  // console.log("user",user)
  // console.log("info",info)

  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  // console.log("UserRoleId",user.roleId);
  const hasAccess = await userService.getUserAccessForMiddleware(user.roleId, getRouteSlugs(req))
  
  if(!hasAccess){
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Restricted Access'));
  }

  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;

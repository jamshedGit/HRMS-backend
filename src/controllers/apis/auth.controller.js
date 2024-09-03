const Cookies = require('cookies');
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../../services");
const { HttpStatusCodes, HttpResponseMessages } = require("../../utils/constants");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  // res.status(httpStatus.CREATED).send({ user, tokens });

  res.send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: { user, tokens },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  // console.log(user.roleId);
  const userAccess = await userService.getUserCompleteRoleAccess(user.roleId);

  // console.log(userAccess);
  const _tokens = await tokenService.generateAuthTokens(user);
  const tokens = {access: _tokens.access.token, refresh: _tokens.refresh.token};
  
  // res.send({ user, tokens, userAccess });
  
  res.send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: { user, tokens, userAccess },
  });

});


const logout = catchAsync(async (req, res) => {
  // const userState =
  await authService.logout(req.body.refreshToken);
  // res.status(httpStatus.NO_CONTENT).send();
  // if(!userState){
  //   res.send({
  //     code: HttpStatusCodes.OK,
  //     message: "User has already loggedOut !"
  //   });
  // }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.send({ access: tokens.access.token, refresh: tokens.refresh.token });
  res.send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: { access: tokens.access.token, refresh: tokens.refresh.token  },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  verifyEmail
};

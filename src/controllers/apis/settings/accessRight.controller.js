const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { accessRightService } = require('../../../services');
const { HttpStatusCodes, HttpResponseMessages } = require('../../../utils/constants');

// const createRole = catchAsync(async (req, res) => {

//     // console.log("reqested User", req.user.id);
//     const role = await accessRightService.createRole(req, req.body);
//     res.status(httpStatus.CREATED).send({
//         code: HttpStatusCodes.CREATED,
//         message: HttpResponseMessages.CREATED,
//         data: role,
//     });
// });

// const getRole = catchAsync(async (req, res) => {
//     const role = await accessRightService.getRoleById(req.body.id);
//     if (!role) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
//     }
//     res.send({
//         code: HttpStatusCodes.OK,
//         message: HttpResponseMessages.OK,
//         data: role,
//     });
// });

const getAccessRights = catchAsync(async (req, res) => {
    // const filter = pick(req.query, ['firstName', 'lastName', 'roleName', 'role']);
    // const options = pick(req.query, ['sortBy', 'limit', 'page']);
    // req.role.dealerId ? Object.assign(obj, { dealerId: req.role.dealerId }) : null;
    const obj = {};
    //   req.role.dealerId ? Object.assign(obj, { dealerId: req.role.dealerId }) : null;
    const filter = obj;
    const options = pick(req.body, ['roleId','sortBy', 'limit', 'page']);
    const result = await accessRightService.getAllAccessRightsByRoleId(filter, options);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: result,
    });
});

const updateAccessRight = catchAsync(async (req, res) => {
    const role = await accessRightService.updateAccessRightByRoleIdAndResourceId(req.body.roleId, req.body.resourceId, req.body);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: role,
    });
});

const deleteAccessRight = catchAsync(async (req, res) => {
    const role = await accessRightService.deleteAccessRightByRoleIdAndResourceId(req.body.roleId, req.body.resourceId);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: role,
    });
});

module.exports = {
    // createAccessRight,
    // getAccessRight,
    getAccessRights,
    updateAccessRight,
    deleteAccessRight,
};

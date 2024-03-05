const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { roleService } = require('../../../services');
const { HttpStatusCodes, HttpResponseMessages } = require('../../../utils/constants');

const createRole = catchAsync(async (req, res) => {

    // console.log("reqested User", req.user.id);
    const role = await roleService.createRole(req, req.body);
    res.status(httpStatus.CREATED).send({
        code: HttpStatusCodes.CREATED,
        message: HttpResponseMessages.CREATED,
        data: role,
    });
});

const getRoles = catchAsync(async (req, res) => {
    // const filter = pick(req.query, ['firstName', 'lastName', 'roleName', 'role']);
    // const options = pick(req.query, ['sortBy', 'limit', 'page']);
    // req.role.dealerId ? Object.assign(obj, { dealerId: req.role.dealerId }) : null;
    const obj = {};
    //   req.role.dealerId ? Object.assign(obj, { dealerId: req.role.dealerId }) : null;
    const filter = obj;
    const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);

    const result = await roleService.queryRoles(req.user.roleId, filter, options, searchQuery);

    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: result,
    });
});

const getRole = catchAsync(async (req, res) => {
    const role = await roleService.getRoleById(req.body.id);
    if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: role,
    });
});

const updateRole = catchAsync(async (req, res) => {
    const role = await roleService.updateRoleById(req.body.id, req.body);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: role,
    });
});

const deleteRole = catchAsync(async (req, res) => {
    req.body.isActive = false;
    const role = await roleService.deleteRoleById(req.body.id, req.body, req.user.id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: role,
    });
});

module.exports = {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRole,
};

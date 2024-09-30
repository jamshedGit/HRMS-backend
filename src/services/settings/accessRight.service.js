const httpStatus = require('http-status');
var _ = require('underscore');
const { ResourceModel, RoleModel, AccessRightModel } = require('../../models');
const ApiError = require('../../utils/ApiError');


const createAccessRight = async (req, AccessRightBody) => {
};

const getAllAccessRightsByRoleId = async (filter, options) => {
    // let limit = options.limit;
    // let offset = 0 + (options.page - 1) * limit
    
    const accessRights = await AccessRightModel.findAll({
        // offset: offset,
        // limit: limit,
        // "totalResults": 1,
        // "limit": 20, 
        // "page": 1,
        // "totalPages": 1
        where: { roleId: options.roleId, isActive: true },
        include: [
            // {
            //   model: RoleModel,
            //   attributes: ['name', 'slug']
            // },
            {
                model: ResourceModel,
                attributes: ['name', 'parentName', 'slug']
            }
        ],
        attributes: ['isAccess', 'isActive', 'roleId', 'resourceId'],
        // order: [
        //     ['id', 'ASC']
        // ]
    });
    const formatedData = [];
    accessRights.forEach((element) => {
        formatedData.push({
            name: element.t_resource.name,
            parentName: element.t_resource.parentName,
            slug: element.t_resource.slug,
            isAccess: element.isAccess,
            isActive: element.isActive,
            roleId: element.roleId,
            resourceId: element.resourceId,
        })
    });

    var groupedData = _.groupBy(formatedData, f=>{return f.parentName});
    delete formatedData.parentName;
    return groupedData;

    // return formatedData;
};

const getAccessRightByRoleIdAndResourceId = async (RoleId, ResourceId) => {
    //   return AccessRightModel.findByPk(id);
    return AccessRightModel.findOne({ where: { roleId: RoleId, resourceId: ResourceId, isActive: true } });
};

const updateAccessRightByRoleIdAndResourceId = async (RoleId, ResourceId, updateBody) => {
    const accessRight = await getAccessRightByRoleIdAndResourceId(RoleId, ResourceId);
    if (!accessRight) {
        throw new ApiError(httpStatus.NOT_FOUND, 'AccessRight not found');
    }
    delete updateBody.roleId;
    delete updateBody.resourceId;
    Object.assign(accessRight, updateBody);
    await accessRight.save();
    return accessRight;
};

const deleteAccessRightByRoleIdAndResourceId = async (RoleId, ResourceId) => {
    const accessRight = await getAccessRightByRoleIdAndResourceId(RoleId, ResourceId);
    if (!accessRight) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
    }
    await accessRight.destroy();
    return accessRight;
};

module.exports = {
    createAccessRight,
    getAllAccessRightsByRoleId,
    getAccessRightByRoleIdAndResourceId,
    updateAccessRightByRoleIdAndResourceId,
    deleteAccessRightByRoleIdAndResourceId
};

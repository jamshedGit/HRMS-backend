const httpStatus = require('http-status');
var _ = require('underscore');
const { ResourceModel, RoleModel, AccessRightModel } = require('../../models');
const ApiError = require('../../utils/ApiError');


const createAccessRight = async (req, AccessRightBody) => {
};

const getAllAccessRightsByRoleId = async (req,filter, options) => {
    // let limit = options.limit;
    // let offset = 0 + (options.page - 1) * limit

//temporary , it will be used by dropdown field in resource table  (future) 
    const not_in_use_set = new Set([33,34,35,37,38,39, 40, 41, 42, 43, 44, 45, 46, 47, 48,122, 123,124, 125, 126,127, 128,129, 130, 131,
        132, 133,134, 135, 136,137, 138,139, 140, 141,162, 164,165, 166,167,169, 170,171,
        172,174, 175,176,182,184, 185,186,197,199, 200,201,212,214, 215,216,218,220, 221,222,
        229,231, 232,233,234,236, 237,238,239,241, 242,243,246,248, 249,250,266,268, 269,270,
        272,273, 274,275,276, 278,279,280,296, 298,299,300,347,364,177,179,180,181,327,1763,240,
        277,271,267,168,297,173,183,178,163,245,247,198,235,230,223,219,357,355,358,359,244,1766,213,217,1759,1760,306,1720,353,354,374,1769,1754,1761,1762,334,333,1742,1745,366,367,368]);

    // Fetch existing access rights for the role
    const existingAccessRights = await AccessRightModel.findAll({
        where: { roleId: options.roleId },
        attributes: ['resourceId']
    });

    const existingResourceIds = new Set(existingAccessRights.map((right) => right.resourceId));

    const createaccessRights = [];

    const allResources = await ResourceModel.findAll({
        where: { isActive: true },
        attributes: ['id', 'slug']
      });

    // Loop through all resources and check if the access rights already exist for that resource
    allResources.forEach((element) => {
        if (!not_in_use_set.has(element.id) && !existingResourceIds.has(element.id)) {
            createaccessRights.push({
                createdBy: req.user.Id,
                resourceId: element.id,
                roleId: options.roleId,
                isAccess: element.slug ? (element.slug === 'get-user-by-token') : false,
            });
        }
    });

    //started from here 

    // If no new access rights need to be created, skip the bulkCreate
    if (createaccessRights.length > 0) {
        try {
            await AccessRightModel.bulkCreate(createaccessRights);
        } catch (error) {
            // throw new Error('Failed to create access rights');
        }
    }


    
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
            
                attributes: ['name', 'parentName', 'slug','sortOrder']
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
            sortOrder:element.t_resource.sortOrder,
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

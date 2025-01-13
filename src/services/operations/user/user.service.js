const httpStatus = require("http-status");
const { User_Model, SubsidiaryModel, RoleModel, AccessRightModel, ResourceModel } = require("../../../models/index");
const { DataTypes } = require('sequelize');
const toPascalCase = require('to-pascal-case');
const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
let _ = require('underscore');
const {
    paginationFacts,

} = require("../../../utils/common");


const Op = Sequelize.Op;


const queryUser = async (
  filter,
  options,
  searchQuery
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

     { name1: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), 'LIKE', '%' + searchQuery + '%') },
    
    ];

  const { count, rows } =
    await User_Model.findAndCountAll({
      order: [
        ["email", "ASC"],   // Use the alias and attribute name
      ],
      where: {
        [Op.or]: queryFilters,
        // isActive: true
      },
      offset: offset,
      limit: limit,
      include: [
        {
            model: RoleModel,
            as: 'role',
            attributes: ['id', 'name'],
        }],
  
    
   
    });

    




  return paginationFacts(count, limit, options.pageNumber, rows);
};


const createUser = async (userBody, createdBy) => {

    if (await User_Model.isEmailTakenNewUser(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    User_Model.beforeCreate(userBody);
    userBody.createdBy = createdBy;
    userBody.isActive=true;
    const user = await User_Model.create(userBody);
    console.log("user222",user)
    return getUserById(user.Id)
};


const getUserById = async (id) => {
  console.log("id111",id)
    return User_Model.findByPk(id, {
        include: [
            {
                model: RoleModel,
                as: 'role',
                attributes: ['id', 'name'],
            }],
    });
};


const deleteUserById = async (Id) => {

    const Item = await getUserById(Id);
    if (!Item) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await Item.destroy();
    return Item;
};

const updateUserById = async (userId, updateBody, updatedBy) => {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  
    if (updateBody.email && (await User_Model.isEmailTakenOldUser(updateBody.email, updateBody.id))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    updateBody.updatedBy = updatedBy;
    delete updateBody.id;
    User_Model.beforeCreate(updateBody);
    Object.assign(user, updateBody);
    const updatedUser = await user.save();
    return getUserById(updatedUser.id)
  };


//getUserCompleteRoleAccess
  
const getUserCompleteRoleAccess = async (roleId) => {
    const roleAccessData = await AccessRightModel.findAll({
      where: { roleId: roleId, isAccess: true, isActive: true },
      
      include: [
        {
          model: RoleModel,
          attributes: ['name', 'slug']
        },
        {
          model: ResourceModel,
          
          where: { isParentShow: true },
          
          attributes: ['name', 'parentName', 'parentSlug', 'slug', 'isResourceShow','sortOrder']
        },
        
      ],
      attributes: ['isAccess', 'isActive', 'roleId', 'resourceId']
  
    });
  
    const formatedData = [];
    roleAccessData.forEach((element) => {
      formatedData.push({
        isResourceShow: element.t_resource.isResourceShow,
        name: element.t_resource.name,
        parentName: element.t_resource.parentName,
        url: element.t_resource.parentSlug + '/' + element.t_resource.slug,
        componentName: toPascalCase(element.t_resource.slug),
        isAccess: element.isAccess,
        slug: element.t_resource.slug,
        sortOrder: element.t_resource.sortOrder,
        parentSlug: element.t_resource.parentSlug,
        resourceId: element.resourceId,
        // isActive: element.isActive,
        // roleId: element.roleId,
      })
    });
    
    var groupedData = _.groupBy(formatedData, f => { return f.parentName });
    delete formatedData.parentName;
    return groupedData;
  
    // if(Array.isArray(groupedData) && groupedData.length > 0)
    //   return groupedData;
    // else
    //   return [];
  };
  

  ///getUserAccessForMiddleware
  const getUserAccessForMiddleware = async (roleId, slugs) => {
  
  
    try {
      const roleAccessData = await AccessRightModel.findAll({
        where: { roleId: roleId, isAccess: true },
        include: [
          {
            model: ResourceModel,
            where: { slug: slugs.rightSlug },
            attributes: ['name', 'parentName', 'slug']
          }
        ],
        attributes: ['isAccess', 'isActive', 'roleId', 'resourceId']
  
      });
  
      return roleAccessData?.[0]?.isAccess || false;
      // return 1
      // return roleAccessData;
    } catch (error) {
      console.log(error)
      return false;
    }
  };
  
  module.exports = {
    createUser,
    queryUser,
    getUserById,
    updateUserById,
    deleteUserById,
  
    getUserAccessForMiddleware,
    getUserCompleteRoleAccess,
  };
  
const httpStatus = require("http-status");
const { User_Model, SubsidiaryModel, RoleModel, AccessRightModel, ResourceModel, Password_history } = require("../../../models/index");
const { DataTypes } = require('sequelize');
const toPascalCase = require('to-pascal-case');
const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
let _ = require('underscore');
const {
  paginationFacts,

} = require("../../../utils/common");

const bcrypt = require('bcryptjs');
const Op = Sequelize.Op;

// for all role , not delete
// const queryUser = async (
//   filter,
//   options,
//   searchQuery
// ) => {
//   let limit = options.pageSize;
//   let offset = 0 + (options.pageNumber - 1) * limit;

//   searchQuery = searchQuery.toLowerCase();
//   const queryFilters = [

//     { name1: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), 'LIKE', '%' + searchQuery + '%') },

//   ];

//   const { count, rows } =
//     await User_Model.findAndCountAll({
//       order: [
//         ["email", "ASC"],   // Use the alias and attribute name
//       ],
//       where: {
//         [Op.or]: queryFilters,
//         // isActive: true
//       },
//       offset: offset,
//       limit: limit,
//       include: [
//         {
//           model: RoleModel,
//           as: 'role',
//           attributes: ['id', 'name'],
//         }],



//     });






//   return paginationFacts(count, limit, options.pageNumber, rows);
// };

const queryUser = async (
  filter,
  options,
  searchQuery, currentUserId
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { name1: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), 'LIKE', '%' + searchQuery + '%') },

  ];


  const rolesMasterData = await RoleModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  });

  const currentUser = await User_Model.findOne({
    where: { Id: currentUserId },  // Assuming currentUserId is passed for the logged-in user
  });


  const allUsers = await User_Model.findAll({
    where: { isActive: true },
    attributes: ['Id', 'roleId', 'supervisedbyId']
  });
  // Recursive function to get all users under a specific supervisorId (direct and indirect supervision)
  const getUsersUnderSupervision = (supervisorId) => {
    // Find all users directly supervised by the given supervisorId
    const directSupervisedUsers = allUsers.filter(user => user.supervisedbyId === supervisorId);

    // Initialize an array to store all supervised users (direct + indirect)
    let allSupervisedUsers = [...directSupervisedUsers];

    // For each directly supervised user, check if they have further subordinates (recursive step)
    directSupervisedUsers.forEach(user => {
      // Recursively find users supervised by this user
      const indirectSupervisedUsers = getUsersUnderSupervision(user.roleId);
      allSupervisedUsers = [...allSupervisedUsers, ...indirectSupervisedUsers];
    });

    // Return all users (direct + indirect)
    return allSupervisedUsers;
  };

  // Function to filter roles based on user's supervisor hierarchy (both direct and indirect supervision)
  const filteredRoles = rolesMasterData.filter(role => {
    // If the current user is Admin (roleId === 1), they can see all roles
    if (currentUser.roleId === 1) {
      return true;  // Super Admin can view all roles
    }

    // For non-admin users, check based on their direct and indirect subordinates
    const allSupervisedUsers = getUsersUnderSupervision(currentUser.roleId);  // Get all users under the current user's supervision


    // Check if the roleId of the current role matches any supervised users' roleId
    const isRoleSupervised = allSupervisedUsers.some(user => user.roleId === role.id);

    // Return true if the role is supervised by the current user, otherwise false

    return isRoleSupervised;
  });





  const { count, rows } =
    await User_Model.findAndCountAll({
      order: [
        ["email", "ASC"],   // Use the alias and attribute name
      ],
      where: {
        [Op.or]: queryFilters,
        roleId: {
          [Op.in]: filteredRoles.map(role => role.id),  // Extract the id from filteredRoles
        },

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
  userBody.isActive = true;
  const user = await User_Model.create(userBody);

 const passwordBody = {
   userId: user.Id,
   password:user.password,
   isActive: true
 };
await Password_history.create(passwordBody);

  //(1773) fixed for user user creation
  const resourceIds = [1773, 1774, 1775, 1776, 1777];

  for (const resourceId of resourceIds) {
    const userForCreation = await AccessRightModel.findOne({
      where: { roleId: user.roleId, resourceId, isActive: true }
    });

    if (userForCreation) {
      userForCreation.isAccess = user.allowUserCreation;
      await userForCreation.save();
    }
  }

  return getUserById(user.Id)
};


const getUserById = async (id) => {

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

  if (updateBody.email && (await User_Model.isEmailTakenOldUser(updateBody.email, updateBody.Id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  updateBody.updatedBy = updatedBy;
  delete updateBody.Id;
  delete updateBody.password
  User_Model.beforeCreate(updateBody);
  Object.assign(user, updateBody);
  const updatedUser = await user.save();
  //(1773) fixed for user user creation
  const resourceIds = [1773, 1774, 1775, 1776, 1777];

  for (const resourceId of resourceIds) {
    const userForCreation = await AccessRightModel.findOne({
      where: { roleId: user.roleId, resourceId, isActive: true }
    });

    if (userForCreation) {
      userForCreation.isAccess = user.allowUserCreation;
      await userForCreation.save();
    }
  }

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

        attributes: ['name', 'parentName', 'parentSlug', 'slug', 'isResourceShow', 'sortOrder']
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


// const getUserCompleteRoleAccess = async (roleId) => {
//   // Fetch role access data from the database
//   const roleAccessData = await AccessRightModel.findAll({
//     include: [
//       {
//         model: RoleModel,
//         attributes: ['name', 'slug']
//       },
//       {
//         model: ResourceModel,
//         where: { isParentShow: true },
//         attributes: ['name', 'parentName', 'parentSlug', 'slug', 'isResourceShow', 'sortOrder', 'isAccessFree']
//       },
//     ],
//     attributes: ['isAccess', 'isActive', 'roleId', 'resourceId']
//   });

//   // Initialize an array to hold formatted data
//   const formatedData = [];

//   // Loop through each item in roleAccessData
//   roleAccessData.forEach((item) => {
//     const resource = item.t_resource;
//     
//     // Check if sortOrder is 1 - this is a special case where we show the data immediately
//     if (resource.isAccessFree == 1) {
//      
//       formatedData.push({
//         isResourceShow: resource.isResourceShow,
//         name: resource.name,
//         parentName: resource.parentName,
//         url: resource.parentSlug + '/' + resource.slug,
//         componentName: toPascalCase(resource.slug),
//         isAccess: item.isAccess,
//         isActive: item.isActive, // Ensure isActive is included
//         slug: resource.slug,
//         sortOrder: resource.sortOrder,
//         parentSlug: resource.parentSlug,
//         resourceId: item.resourceId,
//       });
//     } else {
//       // For sortOrder other than 1, check the roleId, isAccess, and isActive fields
//       if (item.roleId === roleId && item.isAccess && item.isActive) {
//         formatedData.push({
//           isResourceShow: resource.isResourceShow,
//           name: resource.name,
//           parentName: resource.parentName,
//           url: resource.parentSlug + '/' + resource.slug,
//           componentName: toPascalCase(resource.slug),
//           isAccess: item.isAccess,
//           isActive: item.isActive, // Ensure isActive is included
//           slug: resource.slug,
//           sortOrder: resource.sortOrder,
//           parentSlug: resource.parentSlug,
//           resourceId: item.resourceId,
//         });
//       }
//     }
//   });

//   // Group the formatted data by parentName
//   const groupedData = _.groupBy(formatedData, (f) => f.parentName);

//   // Remove parentName from the final object
//   delete formatedData.parentName;

//   // Return the grouped data
//   return groupedData;
// };



// /getUserAccessForMiddleware





// const getUserAccessForMiddleware = async (roleId, slugs) => {


//   try {
//     const roleAccessData = await AccessRightModel.findAll({
//       where: { roleId: roleId, isAccess: true },
//       include: [
//         {
//           model: ResourceModel,
//           where: { slug: slugs.rightSlug },
//           attributes: ['name', 'parentName', 'slug']
//         }
//       ],
//       attributes: ['isAccess', 'isActive', 'roleId', 'resourceId']

//     });

//     return roleAccessData?.[0]?.isAccess || false;
//     // return 1
//     // return roleAccessData;
//   } catch (error) {
//    
//     return false;
//   }
// };


const getUserAccessForMiddleware = async (roleId, slugs) => {


  try {
    const isForDropdown = await ResourceModel.findAll({
      where: { slug: slugs.rightSlug, isAccessFree: true },

    })

    if (isForDropdown?.length == 0) {

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
    }
    else if (isForDropdown?.length > 0) {
      return true;
    }



    // return 1
    // return roleAccessData;
  } catch (error) {
    
    return false;
  }
};

const getUserByEmail = async (email) => {

return User_Model.findOne({
  where: { email: email }  // Ensure the 'where' clause is included
});
};

const resetPassword = async (req,data) => {

  let userData;
  if (data.email) {
    userData = await getUserByEmail(data.email)

  }

  if (!userData || !( await Password_history.isPasswordMatch(userData.Id, data.currentPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }

  const existingPasswords = await Password_history.findAll({
    where: { userId: userData.Id },
  });

  // Check if the new password matches any of the previous passwords
  for (let passwordRecord of existingPasswords) {
  
    const isMatch = bcrypt.compareSync(data.password, passwordRecord.password);
    if (isMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password has been used previously');
    }
  }

 let a= Password_history.beforeCreate(data.password);

  const passwordBody = {
    userId: userData.Id,
    password:a,
    changeDate: new Date(),
    changedById: req.user.Id,
    isActive: true
  };
  const passwordSave = await Password_history.create(passwordBody);


  userData.password = passwordSave.password;
  userData.save();
  return true
};


module.exports = {
  createUser,
  queryUser,
  getUserById,
  updateUserById,
  deleteUserById,

  getUserAccessForMiddleware,
  getUserCompleteRoleAccess,resetPassword
};

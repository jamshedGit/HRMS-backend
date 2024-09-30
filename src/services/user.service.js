const httpStatus = require('http-status');
const { UserModel, RoleModel, ResourceModel, AccessRightModel, CenterModel, SubCenterModel, CountryModel, CityModel } = require('../models');
const ApiError = require('../utils/ApiError');
const Pagination = require('../utils/common');
const { types } = require('joi');
var _ = require('underscore');
var toPascalCase = require('to-pascal-case');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, createdBy) => {

  if (await UserModel.isEmailTakenNewUser(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  UserModel.beforeCreate(userBody);
  userBody.userName = userBody.firstName + '_' + userBody.lastName;
  // delete userBody._id;
  userBody.createdBy = createdBy;
  userBody.tripStatus = "Available";
  
  userBody.isActive = true;

  const user = await UserModel.create(userBody);
  return getUserById(user.id)
};

// const createExample = async (exampleBody, createdBy) => {
//   const jane = await ResourceModel.create({ name: "Add User", slug: "create-user", isActive: 1 });
//   // Jane exists in the database now!
//   console.log(jane instanceof ResourceModel); // true
//   console.log(jane.name); // "Jane"
//   // if (await UserModel.isEmailTaken(exampleBody.email)) {
//   //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   // }
//   // userBody.userName = userBody.firstName + '_' + userBody.lastName;
//   // delete userBody._id;
//   // userBody.createdBy = createdBy;

//   // return UserModel.create(userBody);
// };

// /**
//  * Query for users
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryUsers = async (filter, options) => {
//   // const users = await UserModel.paginate(filter, options);
//   // return users;

//   const dealerId = filter.dealerId ? "YES" : "No";
//   const page = options.page;
//   const limit = options.limit;

//   const pipeline = [
//     // {
//     //   $match: {
//     //     isCompleted: false,
//     //   },
//     // },
//     {
//       $lookup: {
//         from: 'roleaccesses',
//         let: { id: '$role' },
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ['$_id', '$$id'] },
//             },
//           },
//           {
//             "$project": {
//               "_id": true,
//               "name": true,
//             }
//           }
//         ],
//         as: 'roleDetails',
//       },
//     },
//     {
//       $unwind: '$roleDetails',
//     },
//     {
//       $lookup: {
//         from: 'dealers',
//         let: { id: '$dealerId' },
//         pipeline: [
//           {
//             $match: {
//               $expr: { $eq: ['$_id', '$$id'] },
//             },
//           },
//           {
//             "$project": {
//               "_id": true,
//               "name": true,
//             }
//           }
//         ],
//         as: 'dealerDetails',
//       },
//     },
//     {
//       // $unwind: '$dealerDetails',
//       "$unwind": { path: "$dealerDetails", preserveNullAndEmptyArrays: true },
//     }
//   ];

//   if (dealerId == "YES")
//     pipeline.push({
//       $match: {
//         'dealerId': filter.dealerId,
//       }
//     });

//   Pagination.customPaginate(page, limit, pipeline);
//   const result = await UserModel.aggregate(pipeline).allowDiskUse(true);
//   result[0].pagination.totalPages = Math.ceil(result[0].pagination.totalResults / limit);
//   return { results: result[0].results, ...result[0].pagination };
// };

/**
 * Query for Roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options, searchQuery, startDate, endDate) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit
 console.log("user offset ",offset)
  var startDate = Date.parse(startDate);
  var endDate = Date.parse(endDate)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    { firstName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), 'LIKE', '%' + searchQuery + '%') },
    { lastName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), 'LIKE', '%' + searchQuery + '%') },
    { email: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), 'LIKE', '%' + searchQuery + '%') },
    { cnic: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('cnic')), 'LIKE', '%' + searchQuery + '%') },
    { phNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('phNo')), 'LIKE', '%' + searchQuery + '%') },
    { 'center.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.name')), 'LIKE', '%' + searchQuery + '%') },
    { 'subcenter.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subcenter.name')), 'LIKE', '%' + searchQuery + '%') },
    { 'city.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('city.name')), 'LIKE', '%' + searchQuery + '%') },
    { 'country.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('country.name')), 'LIKE', '%' + searchQuery + '%') },
    { 'role.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('role.name')), 'LIKE', '%' + searchQuery + '%') }
    // { firstName: { [Op.like]: '%' + searchQuery + '%' } },
    // { lastName: { [Op.like]: '%' + searchQuery + '%' } },
    // { email: { [Op.like]: '%' + searchQuery + '%' } },
    // { cnic: { [Op.like]: '%' + searchQuery + '%' } },
    // { phNo: { [Op.like]: '%' + searchQuery + '%' } }
  ]
  // const Roles = await UserModel.findAll({
  if (startDate) {
    queryFilters.push({
      createdAt: {
        [Op.between]: [startDate, endDate] // ["2022-09-01T11:32:10.999Z"]
      }
    },
      // {
      //   updatedAt: {
      //     [Op.between]: [startDate, endDate] // ["2022-09-01T11:32:10.999Z"]
      //   }
      // },
    )
  }


  // console.log('search query type', date);


  const { count, rows } = await UserModel.findAndCountAll({
    order: [
      ['updatedAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    include: [
      {
        model: RoleModel,
        as: 'role',
        attributes: ['name'],
      },
      {
        model: CenterModel,
        as: 'center',
        attributes: ['name']
      },
      {
        model: SubCenterModel,
        as: 'subcenter',
        attributes: ['name']
      },
      {
        model: CountryModel,
        as: 'country',
        attributes: ['name']
      },
      {
        model: CityModel,
        as: 'city',
        attributes: ['name'],
      }],
    offset: offset,
    limit: limit,
  });
  // return Roles;
  console.log("count: "+count + " option" + options.pageNumber + " limit: " +limit + " rows " + rows);
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows);

};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<UserModel>}
 */
const getUserById = async (id) => {
  return UserModel.findByPk(id, {
    // attributes: ['firstName']
    include: [
      {
        model: RoleModel,
        as: 'role',
        attributes: ['id','name'],
      },
      {
        model: CenterModel,
        as: 'center',
        attributes: ['id','name']
      },
      {
        model: SubCenterModel,
        as: 'subcenter',
        attributes: ['id','name']
      }],
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const userByEmail = await UserModel.findOne({
    where: { email: email },
    include: [
      {
        model: RoleModel,
        as: 'role',
        attributes: ['name', 'slug'],
      }]
  });

  console.log('userByEmail', userByEmail);
  return userByEmail;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<UserModel>}
 */
const updateUserById = async (userId, updateBody, updatedBy) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // if (updateBody.email && (await UserModel.isEmailTaken(updateBody.email, userId))) {
  if (updateBody.email && (await UserModel.isEmailTakenOldUser(updateBody.email, updateBody.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  UserModel.beforeCreate(updateBody);
  Object.assign(user, updateBody);
  const updatedUser = await user.save();
  return getUserById(updatedUser.id)
};

const updateUserByIdForUserManagement = async (userId, updateBody, updatedBy) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // if (updateBody.email && (await UserModel.isEmailTaken(updateBody.email, userId))) {
  if (updateBody.email && (await UserModel.isEmailTakenOldUser(updateBody.email, updateBody.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (user.isActive) {
    // console.log("User Status", user.isActive)
    // console.log("User2", user.tripStatus.trim())

    if (user.tripStatus.trim() === 'Not Available') {
      // console.log("User Status", user.tripStatus.trim())
      throw new ApiError(httpStatus.NOT_FOUND, 'The user is on a trip. Please try again when the user is available.');
    }
  }
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  UserModel.beforeCreate(updateBody);
  Object.assign(user, updateBody);
  const updatedUser = await user.save();
  return getUserById(updatedUser.id)
};


/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<UserModel>}
 */
const deleteUserById = async (userId, deleteBody, updatedBy) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if(user.isActive){
    console.log("User Status", user.isActive)
    // console.log("User2", user.tripStatus.trim())

    if (user.tripStatus.trim() === 'Not Available'){
      // console.log("User Status", user.tripStatus.trim())
      throw new ApiError(httpStatus.NOT_FOUND, 'The user is on a trip. Please try again when the user is available.');
    }
  }
  // return user;
  // await user.destroy();
  deleteBody.updatedBy = updatedBy;
  delete deleteBody.id;
  // Revert the isActive
  deleteBody.isActive = !user.isActive
  Object.assign(user, deleteBody);
  const updatedUser = await user.save();
  return getUserById(updatedUser.id)
  // return user;
};

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
  
   console.log("formatedData",formatedData);
  var groupedData = _.groupBy(formatedData, f => { return f.parentName });
  delete formatedData.parentName;
  return groupedData;

  // if(Array.isArray(groupedData) && groupedData.length > 0)
  //   return groupedData;
  // else
  //   return [];
};

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



    console.log("roleAccessData", roleAccessData[0].isAccess);
    return roleAccessData[0].isAccess;
    // return roleAccessData;
  } catch (error) {
    console.log(error)
    return false;
  }
};

// const getUserRoleAccess = async (roleId, resourceSlug, rightSlug) => {
//   // const  roleAccessData = await RoleaccessModel.find({ _id: '620ae3d7457b9e47ea85de78'}, {
//   //   resources: {'$elemMatch': {slug: 'user'}}
//   // });
//   try {
//     const roleAccessData = await RoleaccessModel.aggregate([
//       {
//         "$match": {
//           "_id": mongoose.Types.ObjectId(roleId)
//         }
//       },
//       { "$unwind": "$resources" },
//       { "$unwind": "$resources.rights" },
//       {
//         "$match": {
//           "resources.resourceSlug": resourceSlug
//         }
//       },
//       {
//         "$match": {
//           "resources.rights.rightSlug": rightSlug
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           resource: '$resources.resourceSlug',
//           accessname: "$resources.rights.rightSlug",
//           access: "$resources.rights.access"
//         }
//       }
//     ])
//     return roleAccessData;
//   } catch (error) {
//     return error;
//   }
// };


// const updatePasswordMobile = async (email) => {
//   const user = await UserModel.find({ isDeleted: false, email: email })
//   if (!user[0]) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   const userResetPass = await UserModel.findByIdAndUpdate(
//     user[0]._id, { isResetPassword: 1 });
//   Object.assign(userResetPass, { isResetPassword: 1 });
//   await userResetPass.save();
//   return userResetPass;
// };

// const allResetPassUsers = async (filter, options) => {
//   const users = await UserModel.paginate(filter, options);
//   if (!users) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Users not found');
//   }
//   return users;
// };   

// const createNewPassword = async (userId, user) => {
//   const user_find = await getUserById(userId);
//   if (!user_find) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   const userNewPass = await UserModel.findByIdAndUpdate(
//     userId, user);
//   Object.assign(userNewPass, user);
//   await userNewPass.save();
//   return userNewPass;
// };

// const adminResetPassword = async (userId, password, user) => {

//   const user_find = await getUserById(userId);
//   if (!user_find || !(await user_find.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is Incorrect');
//   }
//   const userResetPassword = await UserModel.findByIdAndUpdate(
//     userId, user);
//   Object.assign(userResetPassword, user);
//   await userResetPassword.save();
//   return userResetPassword;
// };

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUserByIdForUserManagement,
  deleteUserById,
  getUserAccessForMiddleware,
  getUserCompleteRoleAccess,
  // getUserRoleAccess,
  // updatePasswordMobile,
  // allResetPassUsers,
  // createNewPassword,
  // adminResetPassword,
  // createExample
};

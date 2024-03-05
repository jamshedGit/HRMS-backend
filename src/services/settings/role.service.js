const httpStatus = require('http-status');
const { RoleModel, ResourceModel, AccessRightModel } = require('../../models');
const Pagination = require('../../utils/common');
const ApiError = require('../../utils/ApiError');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Create a Role
 * @param {Object} RoleBody
 * @returns {Promise<Role>}
 */
const createRole = async (req, RoleBody) => {
  RoleBody.slug = RoleBody.name.replace(/ /g, "-").toLowerCase()
  RoleBody.createdBy = req.user.id
  const roleAdded = await RoleModel.create(RoleBody);

  const allResources = await ResourceModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'slug']
  });
  // console.log("allResources",allResources);

  const accessRights = [];
  allResources.forEach((element) => {
    accessRights.push({
      createdBy: req.user.id,
      resourceId: element.id,
      roleId: roleAdded.id,
      isAccess: element.slug ? (element.slug === 'get-user-by-token') ? true : false : false
    })
  });
  // console.log("accessRights",accessRights);
  const bulkAccessRightsCreated = await AccessRightModel.bulkCreate(accessRights);
  return roleAdded;
};

// const createExample = async (exampleBody, createdBy) => {
//     const jane = await ResourceModel.create({ name: "Add Role", slug:"create-Role", isActive: 1 });
//   // Jane exists in the database now!
//   console.log(jane instanceof ResourceModel); // true
//   console.log(jane.name); // "Jane"
//   // if (await RoleModel.isEmailTaken(exampleBody.email)) {
//   //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   // }
//   // RoleBody.RoleName = RoleBody.firstName + '_' + RoleBody.lastName;
//   // delete RoleBody._id;
//   // RoleBody.createdBy = createdBy;

//   // return RoleModel.create(RoleBody);
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
const queryRoles = async (roleId, filter, options, searchQuery) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit
  searchQuery = searchQuery.toLowerCase();
  var userRole = await getRoleById(roleId);
  userRole = userRole.slug == 'super-admin' ? true : false;

  let whereClause;
  if (userRole !== true) {
    whereClause = {
      // slug: { [Op.not]: 'super-admin' }
      slug: { [Op.not]: ['super-admin', 'admin'] },
    };
  }

  const { count, rows } = await RoleModel.findAndCountAll({
    // const Roles = await RoleModel.findAll({
    where: {
      [Op.or]: [
        {name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + searchQuery + '%')},
      ],
      isActive: true
    },
    where: whereClause,
    offset: offset,
    limit: limit,
    order: [
      ['createdAt', 'DESC']
    ]
  });

  // return Roles;
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows);

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
  // ];

  // if (dealerId == "YES")
  // pipeline.push({
  // $match: {
  //     'dealerId': filter.dealerId,   
  // }
  // });

  // Pagination.customPaginate(page, limit, pipeline);
  // const result = await RoleModel.aggregate(pipeline).allowDiskUse(true);
  // result[0].pagination.totalPages = Math.ceil(result[0].pagination.totalResults / limit);
  // return {results: result[0].results, ...result[0].pagination };
};

/**
 * Get Role by id
 * @param {ObjectId} id
 * @returns {Promise<RoleModel>}
 */
const getRoleById = async (id) => {
  return RoleModel.findByPk(id);
};

/**
 * Get Role by email
 * @param {string} email
 * @returns {Promise<Role>}
 */
const getRoleByEmail = async (email) => {
  return RoleModel.findOne({ where: { email: email } });
};

/**
 * Update Role by id
 * @param {ObjectId} RoleId
 * @param {Object} updateBody
 * @returns {Promise<RoleModel>}
 */
const updateRoleById = async (RoleId, updateBody) => {
  const Role = await getRoleById(RoleId);
  if (!Role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  delete updateBody.id;
  Object.assign(Role, updateBody);
  await Role.save();
  return Role;
};

/**
 * Delete Role by id
 * @param {ObjectId} RoleId
 * @returns {Promise<RoleModel>}
 */
const deleteRoleById = async (RoleId, deleteBody, updatedBy) => {
  const Role = await getRoleById(RoleId);
  if (!Role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  deleteBody.updatedBy = updatedBy;
  delete deleteBody.id;
  Object.assign(Role, deleteBody);
  const updatedRole = await Role.save();
  return getRoleById(updatedRole.id)
  // await Role.destroy();
  // return Role;
};

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  getRoleByEmail,
  updateRoleById,
  deleteRoleById
};

const httpStatus = require('http-status');
const {  ResourceModel, RoleModel, AccessRightModel } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a Resource
 * @param {Object} ResourceBody
 * @returns {Promise<Resource>}
 */
const createResource = async (req, ResourceBody) => {
     ResourceBody.parentSlug = ResourceBody.parentName.replace(/ /g, "-").toLowerCase()
     ResourceBody.createdBy = req.user.id
  // return ResourceModel.create(ResourceBody);
  const resourceAdded = await ResourceModel.create(ResourceBody);
  const allRoles = await RoleModel.findAll({
    where: { isActive: true },
    attributes: ['id','slug']
  });
  // console.log("allResources",allResources);
  const accessRights = [];
  allRoles.forEach((element) => {
    accessRights.push({
      createdBy: req.user.id,
      roleId: element.id,
      resourceId: resourceAdded.id,
      isAccess:  ResourceBody.slug ? (ResourceBody.slug === 'get-user-by-token') ? true : false : false
    })
  });
  // console.log("accessRights",accessRights);
  const bulkAccessRightsCreated = await AccessRightModel.bulkCreate(accessRights);
};

/**
 * Query for Resources
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryResources = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit
  const Resources = await ResourceModel.findAll({
        offset: offset,
        limit: limit,
        // order: [
        //     ['date', 'ASC']
        // ]
    });
  return Resources;

//   const pipeline = [
//     // {
//     //   $match: {
//     //     isCompleted: false,
//     //   },
//     // },
//     {
//       $lookup: {
//         from: 'Resourceaccesses',
//         let: { id: '$Resource' },
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
//         as: 'ResourceDetails',
//       },
//     },
//     {
//       $unwind: '$ResourceDetails',
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
// const result = await ResourceModel.aggregate(pipeline).allowDiskUse(true);
// result[0].pagination.totalPages = Math.ceil(result[0].pagination.totalResults / limit);
// return {results: result[0].results, ...result[0].pagination };
};

/**
 * Get Resource by id
 * @param {ObjectId} id
 * @returns {Promise<ResourceModel>}
 */
const getResourceById = async (id) => {
  return ResourceModel.findByPk(id);
};

/**
 * Get Resource by email
 * @param {string} email
 * @returns {Promise<Resource>}
 */
const getResourceByEmail = async (email) => {
  return ResourceModel.findOne({ where: { email: email } });
};

/**
 * Update Resource by id
 * @param {ObjectId} ResourceId
 * @param {Object} updateBody
 * @returns {Promise<ResourceModel>}
 */
const updateResourceById = async (ResourceId, updateBody) => {
  const Resource = await getResourceById(ResourceId);
  if (!Resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  delete updateBody.id;
  Object.assign(Resource, updateBody);
  await Resource.save();
  return Resource;
};

/**
 * Delete Resource by id
 * @param {ObjectId} ResourceId
 * @returns {Promise<ResourceModel>}
 */
const deleteResourceById = async (ResourceId) => {
  const Resource = await getResourceById(ResourceId);
  if (!Resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await Resource.destroy();
  return Resource;
};

module.exports = {
  createResource,
  queryResources,
  getResourceById,
  getResourceByEmail,
  updateResourceById,
  deleteResourceById
};

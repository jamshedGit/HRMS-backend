const httpStatus = require("http-status");
const { IncidentTypeModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a IncidentType
 * @param {Object} IncidentTypeBody
 * @returns {Promise<IncidentType>}
 */
const createIncidentType = async (req, IncidentTypeBody) => {
  // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
  IncidentTypeBody.createdBy = req.user.id;
  const IncidentTypeAdded = await IncidentTypeModel.create(IncidentTypeBody);

  return IncidentTypeAdded;
};

/**
 * Query for IncidentType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIncidentTypes = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const IncidentTypes = await IncidentTypeModel.findAll({
    offset: offset,
    limit: limit,
  });
  return IncidentTypes;
};

/**
 * Get IncidentType by id
 * @param {ObjectId} id
 * @returns {Promise<IncidentTypeModel>}
 */
const getIncidentTypeById = async (id) => {
  return IncidentTypeModel.findByPk(id);
};

/**
 * Update IncidentType by id
 * @param {ObjectId} IncidentTypeId
 * @param {Object} updateBody
 * @returns {Promise<IncidentTypeModel>}
 */
const updateIncidentTypeById = async (IncidentTypeId, updateBody, updatedBy) => {
  const IncidentType = await getIncidentTypeById(IncidentTypeId);
  if (!IncidentType) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Type not found");
  }
  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(IncidentType, updateBody);
  await IncidentType.save();
  return IncidentType;
};

/**
 * Delete IncidentType by id
 * @param {ObjectId} IncidentTypeId
 * @returns {Promise<IncidentTypeModel>}
 */
const deleteIncidentTypeById = async (IncidentTypeId) => {
  const IncidentType = await getIncidentTypeById(IncidentTypeId);
  if (!IncidentType) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Type not found");
  }
  await IncidentType.destroy();
  return IncidentType;
};

module.exports = {
  createIncidentType,
  queryIncidentTypes,
  getIncidentTypeById,
  updateIncidentTypeById,
  deleteIncidentTypeById,
};

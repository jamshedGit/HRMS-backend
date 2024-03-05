const httpStatus = require("http-status");
const { IncidentSeverityModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a IncidentSeverity
 * @param {Object} IncidentSeverityBody
 * @returns {Promise<IncidentSeverity>}
 */
const createIncidentSeverity = async (req, IncidentSeverityBody) => {
  // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
  IncidentSeverityBody.createdBy = req.user.id;
  const IncidentSeverityAdded = await IncidentSeverityModel.create(IncidentSeverityBody);

  return IncidentSeverityAdded;
};

/**
 * Query for IncidentSeverities
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIncidentSeverities = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const IncidentSeverities = await IncidentSeverityModel.findAll({
    offset: offset,
    limit: limit,
  });
  return IncidentSeverities;
};

/**
 * Get IncidentSeverity by id
 * @param {ObjectId} id
 * @returns {Promise<IncidentSeverityModel>}
 */
const getIncidentSeverityById = async (id) => {
  return IncidentSeverityModel.findByPk(id);
};

/**
 * Update IncidentSeverity by id
 * @param {ObjectId} IncidentSeverityId
 * @param {Object} updateBody
 * @returns {Promise<IncidentSeverityModel>}
 */
const updateIncidentSeverityById = async (IncidentSeverityId, updateBody, updatedBy) => {
  const IncidentSeverity = await getIncidentSeverityById(IncidentSeverityId);
  if (!IncidentSeverity) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Severity not found");
  }
  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(IncidentSeverity, updateBody);
  await IncidentSeverity.save();
  return IncidentSeverity;
};

/**
 * Delete IncidentSeverity by id
 * @param {ObjectId} IncidentSeverityId
 * @returns {Promise<IncidentSeverityModel>}
 */
const deleteIncidentSeverityById = async (IncidentSeverityId) => {
  const IncidentSeverity = await getIncidentSeverityById(IncidentSeverityId);
  if (!IncidentSeverity) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Severity not found");
  }
  await IncidentSeverity.destroy();
  return IncidentSeverity;
};

module.exports = {
  createIncidentSeverity,
  queryIncidentSeverities,
  getIncidentSeverityById,
  updateIncidentSeverityById,
  deleteIncidentSeverityById,
};

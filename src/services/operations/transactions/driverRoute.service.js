const httpStatus = require("http-status");
const { DriverRouteModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a DriverRoute
 * @param {Object} DriverRouteBody
 * @returns {Promise<DriverRoute>}
 */
const createDriverRoute = async (req, DriverRouteBody) => {
  // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
  DriverRouteBody.createdBy = req.user.id;
  const driverRouteAdded = await DriverRouteModel.create(DriverRouteBody);

  return driverRouteAdded;
};

/**
 * Query for DriverRoute
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDriverRoutes = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const DriverRoutes = await DriverRouteModel.findAll({
    offset: offset,
    limit: limit,
  });
  return DriverRoutes;
};

/**
 * Get DriverRoute by id
 * @param {ObjectId} id
 * @returns {Promise<DriverRouteModel>}
 */
const getDriverRouteById = async (id) => {
  return DriverRouteModel.findByPk(id);
};

/**
 * Update DriverRoute by id
 * @param {ObjectId} DriverRouteId
 * @param {Object} updateBody
 * @returns {Promise<DriverRouteModel>}
 */
const updateDriverRouteById = async (DriverRouteId, updateBody, updatedBy) => {
  const DriverRoute = await getDriverRouteById(DriverRouteId);
  if (!DriverRoute) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver Route not found");
  }
  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(DriverRoute, updateBody);
  await DriverRoute.save();
  return DriverRoute;
};

/**
 * Delete DriverRoute by id
 * @param {ObjectId} DriverRouteId
 * @returns {Promise<DriverRouteModel>}
 */
const deleteDriverRouteById = async (DriverRouteId) => {
  const DriverRoute = await getDriverRouteById(DriverRouteId);
  if (!DriverRoute) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver Route not found");
  }
  await DriverRoute.destroy();
  return DriverRoute;
};

module.exports = {
  createDriverRoute,
  queryDriverRoutes,
  getDriverRouteById,
  updateDriverRouteById,
  deleteDriverRouteById,
};

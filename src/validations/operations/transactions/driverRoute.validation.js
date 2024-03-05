const Joi = require("joi");

const createDriverRoute = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    source: Joi.string().required(),
    destination: Joi.string().required(),    
    initialReading: Joi.string().required(),
    finalReading: Joi.string().required(),
    driverId: Joi.number().integer().required(),
    incidentId: Joi.number().integer().required(),
    vehicleId: Joi.number().integer().required(),
    subCenterId: Joi.number().integer().required()
  }),
};

const getDriverRoutes = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDriverRoute = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateDriverRoute = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      source: Joi.string().allow(),
      destination: Joi.string().allow(),    
      initialReading: Joi.string().allow(),
      finalReading: Joi.string().allow(),
      driverId: Joi.number().integer().allow(),
      incidentId: Joi.number().integer().allow(),
      vehicleId: Joi.number().integer().allow(),
      subCenterId: Joi.number().integer().allow()
    })
    .min(1),
};
const deleteDriverRoute = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createDriverRoute,
  getDriverRoutes,
  getDriverRoute,
  updateDriverRoute,
  deleteDriverRoute,
};

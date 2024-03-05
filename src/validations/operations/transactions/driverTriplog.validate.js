const Joi = require("joi");

const createDriverTriplog = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    startDateTime: Joi.date().required(),
    endDateTime: Joi.date().required(),    
    // initialReading: Joi.number().integer().required(),
    // finalReading: Joi.string().required(),
    // price: Joi.string().required(),
    // logBookNo: Joi.number().integer().required(),
    kiloMeters: Joi.number().integer().required(),
    status: Joi.boolean().required(),
    dateTime: Joi.date().required(),   
    // driverId: Joi.number().integer().required(),
    incidentId: Joi.number().integer().required(),
    centerId: Joi.number().integer().required(),
    vehicleId: Joi.array().items(Joi.number().integer().required())
  }),
};

const getDriverTriplogs = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    filter: Joi.allow(),
    sortOrder: Joi.string(),
    pageSize: Joi.number().integer(),
    pageNumber: Joi.number().integer(),
  }),
};

const getDriverTriplog = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const getDriverTriplogByIncidentId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    incidentId: Joi.number().integer(),
    filter: Joi.allow(),
    sortOrder: Joi.string(),
    pageSize: Joi.number().integer(),
    pageNumber: Joi.number().integer(),
  }),
};

const getDriverTriplogByVehicleId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    vehicleId: Joi.number().integer(),
    filter: Joi.allow(),
    sortOrder: Joi.string(),
    pageSize: Joi.number().integer(),
    pageNumber: Joi.number().integer(),
  }),
};

const updateDriverTriplog = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      startDateTime: Joi.date().allow(),
      endDateTime: Joi.date().allow(),    
      initialReading: Joi.number().integer().allow(),
      finalReading: Joi.number().integer().allow(),
      kiloMeters: Joi.number().integer().allow(),
      status: Joi.string().allow(),
      dateTime: Joi.date().allow(),
      price: Joi.number().integer().allow(),
      logBookNo: Joi.number().integer().allow(),   
      subCenterId: Joi.number().integer().required(),
      // incidentId: Joi.number().integer().allow(),
      // centerId: Joi.number().integer().allow(),
      // vehicleId: Joi.array().items(Joi.number().integer().allow())
    })
    .min(1),
};
const deleteDriverTriplog = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createDriverTriplog,
  getDriverTriplogs,
  getDriverTriplog,
  updateDriverTriplog,
  deleteDriverTriplog,
  getDriverTriplogByIncidentId,
  getDriverTriplogByVehicleId
};

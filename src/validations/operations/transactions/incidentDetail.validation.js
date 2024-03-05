const Joi = require("joi");
// const { password, objectId } = require('./custom.validation');

const createIncidentDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: 
    Joi.object().keys({
    id: Joi.disallow(),
    callerName: Joi.string().required(),
    callerCNIC: Joi.string().allow(''),
    callerPhoneNo: Joi.string().required(),
    patientName: Joi.string().allow(''),
    patientCNIC: Joi.string().allow(''),
    shortDescription: Joi.string().allow(''),
      location: Joi.string().allow(''),
    area: Joi.string().required(),
    incidentTypeId:Joi.number().integer(),
    incidentSeverityId:Joi.number().integer(),
    // centerId: Joi.number().integer().required(),
    alarmTimeId: Joi.number().integer(),
    vehicleId: Joi.array().items(Joi.number().integer().required())
  }),
};

const getIncidentDetails = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    filter: Joi.allow(),
    sortOrder: Joi.string(),
    pageSize: Joi.number().integer(),
    pageNumber: Joi.number().integer(),
  }),
};

const getIncidentDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateIncidentDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
        id: Joi.number().integer(),
        callerName: Joi.string().allow(''),
        callerCNIC: Joi.string().allow(''),
        callerPhoneNo: Joi.string().allow(''),
        patientName: Joi.string().allow(''),
        patientCNIC: Joi.string().allow(''),
        shortDescription: Joi.string().allow(''),
        location: Joi.string().allow(''),
        area: Joi.string().allow(''),
        incidentTypeId:Joi.number().integer().allow(),
        incidentSeverityId:Joi.number().integer().allow(),
        // centerId: Joi.number().integer().allow(),
        alarmTimeId: Joi.number().integer().allow(),
        oldVehicleId: Joi.array().items(Joi.number().integer().allow()),
        newVehicleId:Joi.array().items(Joi.number().integer().allow()),
    })
    .min(1),
};

const deleteIncidentDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createIncidentDetail,
  getIncidentDetails,
  getIncidentDetail,
  updateIncidentDetail,
  deleteIncidentDetail,
};

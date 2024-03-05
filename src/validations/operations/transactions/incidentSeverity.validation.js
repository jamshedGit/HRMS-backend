const Joi = require("joi");
// const { password, objectId } = require('./custom.validation');

const createIncidentSeverity = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    name: Joi.string().required(),
  }),
};

const getIncidentSeverities = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getIncidentSeverity = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateIncidentSeverity = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
        id: Joi.number().integer(),
        name: Joi.string().allow(),
    })
    .min(1),
};

const deleteIncidentSeverity = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createIncidentSeverity,
  getIncidentSeverities,
  getIncidentSeverity,
  updateIncidentSeverity,
  deleteIncidentSeverity,
};

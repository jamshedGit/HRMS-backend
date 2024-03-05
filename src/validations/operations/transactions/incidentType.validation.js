const Joi = require("joi");
// const { password, objectId } = require('./custom.validation');

const createIncidentType = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    name: Joi.string().required(),
  }),
};

const getIncidentTypes = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getIncidentType = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateIncidentType = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
        id: Joi.number().integer(),
        name: Joi.string().allow(),
    })
    .min(1),
};

const deleteIncidentType = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createIncidentType,
  getIncidentTypes,
  getIncidentType,
  updateIncidentType,
  deleteIncidentType,
};

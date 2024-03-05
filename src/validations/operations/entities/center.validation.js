const Joi = require("joi");
// const { password, objectId } = require('./custom.validation');

const createCenter = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    name: Joi.string().required(),
    phoneNo: Joi.string().required(),
    location: Joi.string().allow(''),
    longitude: Joi.number().precision(2).allow(''),
    latitude: Joi.number().precision(2).allow(''),
    countryId: Joi.number().integer().required(),
    cityId: Joi.number().integer().required(),
    // slug: Joi.string().required(),
    // createdBy: Joi.string().required(),
    // updatedBy: Joi.allow(),
  }),
};

const getCenters = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    filter: Joi.allow(),
    sortOrder: Joi.string(),
    pageSize: Joi.number().integer(),
    pageNumber: Joi.number().integer(),
    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

const getCenter = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateCenter = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      name: Joi.string().allow(),
      phoneNo: Joi.string().allow(),
      location: Joi.string().allow(),
      longitude: Joi.number().precision(2).allow(''),
      latitude: Joi.number().precision(2).allow(''),
      countryId: Joi.number().integer().allow(),
      cityId: Joi.number().integer().allow(),
      //   slug: Joi.string().allow(),
      //   parentName: Joi.string().allow(),
      //   isResourceShow: Joi.boolean().allow(),
    })
    .min(1),
};

const deleteCenter = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createCenter,
  getCenters,
  getCenter,
  updateCenter,
  deleteCenter,
};

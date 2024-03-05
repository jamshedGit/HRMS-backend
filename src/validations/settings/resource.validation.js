const Joi = require('joi');
// const { password, objectId } = require('./custom.validation');

const createResource = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    name: Joi.string().required(),
    slug: Joi.string().required(),
    parentName: Joi.string().required(),
    isResourceShow: Joi.boolean().allow(),
    // createdBy: Joi.string().required(),
    // updatedBy: Joi.allow(),
  }),
};

const getResources = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getResource = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer()
  }),
};

const updateResource = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      name: Joi.string().allow(),
      slug: Joi.string().allow(),
      parentName: Joi.string().allow(),
      isResourceShow: Joi.boolean().allow(),
    })
    .min(1),
};

const deleteResource = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer()
  }),
};

module.exports = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};

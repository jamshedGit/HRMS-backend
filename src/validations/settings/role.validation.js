const Joi = require('joi');
// const { password, objectId } = require('./custom.validation');

const createRole = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    name: Joi.string().required(),
    // createdBy: Joi.string().required(),
    // updatedBy: Joi.allow(),
  }),
};

const getRoles = {
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

const getRole = {
  query: Joi.disallow(),
  params: Joi.disallow(),  
  body: Joi.object().keys({
    id: Joi.number().integer()
  }),
};

const updateRole = {
  query: Joi.disallow(),
  params: Joi.disallow(),    
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      name: Joi.string(),
    })
    .min(1),
};

const deleteRole = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer()
  }),
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};

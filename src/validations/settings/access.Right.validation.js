const Joi = require('joi');

// const createAccessRight = {
//   query: Joi.disallow(),
//   params: Joi.disallow(),
//   body: Joi.disallow(),
//   body: Joi.object().keys({
//     id: Joi.disallow(),
//     name: Joi.string().required(),
//     slug: Joi.string().required(),
//     parentName: Joi.string().required(),
//     isAccessRightShow: Joi.boolean().allow(),
    // createdBy: Joi.string().required(),
    // updatedBy: Joi.allow(),
//   }),   
// };


// const getAccessRight = {
//   query: Joi.disallow(),
//   params: Joi.disallow(),  
//   body: Joi.object().keys({
//     id: Joi.number().integer()
//   }),
// };

const getAccessRights = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
      roleId: Joi.number().integer().required(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  };

const updateAccessRight = {
  query: Joi.disallow(),
  params: Joi.disallow(),    
  body: Joi.object()
    .keys({
      roleId: Joi.number().integer().required(),
      resourceId: Joi.number().integer().required(),
      isAccess: Joi.boolean().allow(),
    })
    .min(1),
};

const deleteAccessRight = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    roleId: Joi.number().integer().required(),
    resourceId: Joi.number().integer().required(),
  }),
};

module.exports = {
  getAccessRights,
  updateAccessRight,
  deleteAccessRight,
//   createAccessRight,
//   getAccessRight,
};

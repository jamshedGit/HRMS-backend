const Joi = require("joi");

/**
 * For Creating Single Leave Type Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    code: Joi.string().pattern(/^[A-Za-z]{1,3}$/).required(),
    name: Joi.string().required(),
    type: Joi.number().integer().min(1).max(2).required()
  }),
};

/**
 * For Updating Single Leave Type Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    code: Joi.string().pattern(/^[A-Za-z]{1,3}$/).required(),
    name: Joi.string().required(),
    type: Joi.number().integer().min(1).max(2).required(),
    isActive: Joi.number().optional(),
    typeName: Joi.string().optional(),
  }),
};

/**
 * For Getting Single Leave Type Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Getting All Leave Type Records
 */
const getAllItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortOrder: Joi.string().required(),
    pageSize: Joi.number().required(),
    pageNumber: Joi.number().required(),
    filter: Joi.object().keys({
      searchQuery: Joi.optional()
    })
  }),
};

/**
 * For Getting Leave Type Dropdown data
 */
const getItemWihoutId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};

/**
 * For Deleting Single Leave Type Records By Id in Params
 */
const deleteSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

module.exports = {
  createItem,
  updateItem,
  getSingleItem,
  getAllItem,
  deleteSingleItem,
  getItemWihoutId
};
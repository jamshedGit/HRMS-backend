const Joi = require("joi");

/**
 * For Creating Single Arrear Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    type: Joi.string().required(),
    divisor: Joi.string().optional().allow(''),
    days: Joi.string().optional().allow(''),
    multiplier: Joi.string().optional().allow('')
  }),
};

/**
 * For Updating Single Arrear Record
 */
const updateitem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    type: Joi.string().required(),
    type_name: Joi.string().optional(),
    divisor: Joi.string().optional().allow(''),
    days: Joi.string().optional().allow(''),
    multiplier: Joi.string().optional().allow('')
  }),
};

/**
 * For Getting All Arrear Records
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
 * For Getting Single Arrear Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Deleting Single Arrear Records By Id in Params
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
  getAllItem,
  getSingleItem,
  updateitem,
  deleteSingleItem
};

const Joi = require("joi");

/**
 * For Creating Single Arrear Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    type: Joi.number().required(),
    divisor: Joi.number().optional(),
    days: Joi.number().optional(),
    multiplier: Joi.number().optional()
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
    type: Joi.number().required(),
    type_name: Joi.string().optional(),
    divisor: Joi.number().optional(),
    days: Joi.number().optional(),
    multiplier: Joi.number().optional()
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

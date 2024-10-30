const Joi = require("joi");

/**
 * For Creating Single Allocate Leaves Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    subsidiaryId: Joi.number().optional(),
    cycleTypeId: Joi.number().optional(),
    yearId: Joi.number().optional(),
    list: Joi.array().items(
      Joi.object().keys({
        Id: Joi.number().optional(),
        leaveType: Joi.number().required(),
        leaveCount: Joi.number().required(),
        policyType: Joi.number().required(),
        maxCount: Joi.number().required(),
      })
    ).min(1).required(),
  }),
};

/**
 * For Updating Single Allocate Leaves Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required()
  }),
};

/**
 * For Getting Single Allocate Leaves Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Getting All Allocate Leaves Records
 */
const getAllItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    subsidiaryId: Joi.number().optional(),
    cycleTypeId: Joi.number().optional(),
    yearId: Joi.number().optional()
  }),
};

/**
 * For Getting Allocate Leaves Dropdown data
 */
const getItemWihoutId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};

/**
 * For Deleting Single Allocate Leaves Records By Id in Params
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

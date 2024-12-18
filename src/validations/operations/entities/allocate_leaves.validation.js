const Joi = require("joi");

/**
 * For Creating Single Allocate Leaves Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    subsidiaryId: Joi.number().required(),
    list: Joi.array().items(
      Joi.object().keys({
        Id: Joi.optional(),
        leaveType: Joi.number().required(),
        entitledAt: Joi.number().optional().allow(null),
        gender: Joi.number().allow(null).optional(),
        minExp: Joi.optional(),
        maxAllowed: Joi.number().optional(),
        attachmentRequired: Joi.boolean().optional(),
        encashable: Joi.boolean().optional(),
        carryForwardable: Joi.boolean().optional(),
        encashableCount: Joi.number().optional().allow(""),
        carryForwardableCount: Joi.number().optional().allow(""),
        maritalStatus: Joi.number().allow(null).optional(),
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

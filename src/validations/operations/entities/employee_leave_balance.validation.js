const Joi = require("joi");

/**
 * For Creating Single Employee Leave Balance Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeId: Joi.number().required(),
    leaveType: Joi.number().required(),
    yearId: Joi.number().required(),
    allocatedCount: Joi.number().required()
  }),
};

/**
 * For Updating Single Employee Leave Balance Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    employeeId: Joi.number().required(),
    leaveType: Joi.number().required(),
    yearId: Joi.number().required(),
    allocatedCount: Joi.number().required(),
    availedCount: Joi.number().required(),
    remainingCount: Joi.number().required(),
    carryForwardCount: Joi.number().required(),
    lateCount: Joi.number().required(),
    encashmentCount: Joi.number().required(),
  }),
};

/**
 * For Getting Single Employee Leave Balance Records By Filters
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeId: Joi.number().required(),
    leaveType: Joi.number().required(),
    yearId: Joi.number().required()
  }),
};

/**
 * For Getting All Employee Leave Balance Records
 */
const getAllItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeId: Joi.number().required(),
  }),
};

/**
 * For Deleting Single Employee Leave Balance Records By Id in Params
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
};

const Joi = require("joi");

/**
 * For Creating Single Leave Application Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeId: Joi.number().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    leaveType: Joi.number().required(),
    remarks: Joi.string().optional(),
    file: Joi.number().optional(),
  }),
};

/**
 * For Updating Single Leave Application Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    employeeId: Joi.number().optional(),
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    leaveType: Joi.number().optional(),
    remarks: Joi.string().optional(),
    file: Joi.number().optional(),
  }),
};

/**
 * For Getting Single Leave Application Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Getting All Leave Application Records
 */
const getAllItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeId: Joi.number().required(),
    sortOrder: Joi.string().required(),
    pageSize: Joi.number().required(),
    pageNumber: Joi.number().required(),
    filter: Joi.object().keys({
      searchQuery: Joi.optional()
    })
  }),
};

/**
 * For Getting Leave Application Dropdown data
 */
const getItemWihoutId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};

/**
 * For Deleting Single Leave Application Records By Id in Params
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

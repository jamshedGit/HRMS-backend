const Joi = require("joi");

/**
 * For Creating Single Employee Roster Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
    shiftId: Joi.number().required(),
    subsidiaryId: Joi.number().required(),
    list: Joi.array().items(
      Joi.object().keys({
        employeeId: Joi.number().required(),
      })
    ).min(1).required(),
  }),
};

/**
 * For Updating Single Employee Roster Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    shiftId: Joi.number().required(),
    subsidiaryId: Joi.number().required(),
    list: Joi.array().items(
      Joi.object().keys({
        employeeId: Joi.number().optional(),
      })
    ).min(1).optional(),
  }),
};

/**
 * For Getting Single Employee Roster Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Getting All Employee Roster Records
 */
const getAllItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortOrder: Joi.string().required(),
    pageSize: Joi.number().required(),
    pageNumber: Joi.number().required(),
    filter: Joi.object().keys({
      searchQuery: Joi.optional(),
      subsidiaryId: Joi.optional()
    })
  }),
};

/**
 * For Getting Employee Roster Dropdown data
 */
const getItemWihoutId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};

/**
 * For Deleting Single Employee Roster Records By Id in Params
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

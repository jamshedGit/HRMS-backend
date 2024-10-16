const Joi = require("joi");

/**
 * For Creating Single Leave Management Configuration Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    subsidiaryId: Joi.number().required(),
    employeeTypeId: Joi.number().required(),
    gradeId: Joi.number().required(),
    weekend: Joi.array().optional(),
    isSandwich: Joi.boolean().optional(),
    leavetypePolicies: Joi.array().items(
      Joi.object().keys({
        leaveType: Joi.number().required(),
        gender: Joi.number().required(),
        minExp: Joi.number().required(),
        maxAllowed: Joi.number().required(),
        attachmentRequired: Joi.boolean().required(),
        maritalStatus: Joi.number().required(),
      })
    ).optional(),

    leaveTypeSalaryDeductionPolicies: Joi.array().items(
      Joi.object().keys({
        leaveType: Joi.number().required(),
        minLeave: Joi.number().required(),
        maxLeave: Joi.number().required(),
        deduction: Joi.number().required(),
        leaveStatus: Joi.number().required(),
      })
    ).optional(),
  }),
};

/**
 * For Updating Single Leave Management Configuration Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.number().integer().min(1).max(2).required(),
    isActive: Joi.number().optional(),
    typeName: Joi.string().optional(),
  }),
};

/**
 * For Getting Single Leave Management Configuration Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Getting All Leave Management Configuration Records
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
 * For Getting Leave Management Configuration Dropdown data
 */
const getItemWihoutId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};

/**
 * For Deleting Single Leave Management Configuration Records By Id in Params
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

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
        gender: Joi.number().allow(null).required(),
        minExp: Joi.number().required(),
        maxAllowed: Joi.number().required(),
        attachmentRequired: Joi.boolean().required(),
        maritalStatus: Joi.number().allow(null).required(),
      })
    ).optional(),

    leaveTypeSalaryDeductionPolicies: Joi.array().items(
      Joi.object().keys({
        leaveType: Joi.number().required(),
        minLeave: Joi.number().required(),
        maxLeave: Joi.number().required(),
        deduction: Joi.number().required(),
        leaveStatus: Joi.number().allow(null).required(),
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
    subsidiaryId: Joi.number().required(),
    employeeTypeId: Joi.number().required(),
    gradeId: Joi.number().required(),
    weekend: Joi.array().optional(),
    isSandwich: Joi.boolean().optional(),
    leavetypePolicies: Joi.array().items(
      Joi.object().keys({
        Id: Joi.number().optional(),
        leaveType: Joi.number().required(),
        gender: Joi.number().allow(null).required(),
        minExp: Joi.number().required(),
        maxAllowed: Joi.number().required(),
        attachmentRequired: Joi.boolean().required(),
        maritalStatus: Joi.number().allow(null).required(),
      })
    ).optional(),

    leaveTypeSalaryDeductionPolicies: Joi.array().items(
      Joi.object().keys({
        Id: Joi.number().optional(),
        leaveType: Joi.number().required(),
        minLeave: Joi.number().required(),
        maxLeave: Joi.number().required(),
        deduction: Joi.number().required(),
        leaveStatus: Joi.number().allow(null).required(),
      })
    ).optional(),
  }),
};

/**
 * For Getting Single Leave Management Configuration Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number(),
    subsidiaryId: Joi.number(),
    employeeTypeId: Joi.number(),
    gradeId: Joi.number(),
  }).custom((value, helpers) => {
    const { Id, subsidiaryId, employeeTypeId, gradeId } = value;

    if (Id == null && (subsidiaryId == null || employeeTypeId == null || gradeId == null)) {
      return helpers.error('Either Id is required or subsidiaryId, employeeTypeId, gradeId are required'); // Custom error if neither condition is met
    }

    return value; // Return the value if validation passes
  })
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

const Joi = require("joi");

/**
 * For Getting All Leave Applications By Filters
 */
const getAllItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortOrder: Joi.string().required(),
    pageSize: Joi.number().optional(),
    pageNumber: Joi.number().required(),
    filter: Joi.object().keys({
      subsidiaryId: Joi.number().allow('').optional(),
      departmentId: Joi.number().allow('').optional(),
      reportTo: Joi.number().allow('').optional(),
      gradeId: Joi.number().allow('').optional(),
      designationId: Joi.number().allow('').optional(),
      locationId: Joi.number().allow('').optional(),
      attendanceType: Joi.number().allow('').optional(),
      employeeId: Joi.number().allow('').optional(),
      monthId: Joi.number().allow('').optional(),
      groupBy: Joi.optional()
    })
  }),
};


const getItemForPdf = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    subsidiaryId: Joi.number().allow('').optional(),
    departmentId: Joi.number().allow('').optional(),
    reportTo: Joi.number().allow('').optional(),
    gradeId: Joi.number().allow('').optional(),
    designationId: Joi.number().allow('').optional(),
    locationId: Joi.number().allow('').optional(),
    attendanceType: Joi.number().allow('').optional(),
    employeeId: Joi.number().allow('').optional(),
    monthId: Joi.number().allow('').optional(),
    labels: Joi.object().optional(),
    groupBy: Joi.optional()
  }),
}

module.exports = {
  getAllItem,
  getItemForPdf
};
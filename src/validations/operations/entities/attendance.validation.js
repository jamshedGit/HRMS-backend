const Joi = require("joi");

/**
 * For Creating Single Attendance Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeId: Joi.number().required(),
    subsidiaryId: Joi.number().optional(),
    employeeCode: Joi.string().optional(),
    comments: Joi.string().required(),
    attDate: Joi.date().optional(),
    attDateIn: Joi.date().required(),
    attDateOut: Joi.date().required(),
    timeIn: Joi.string().required(),
    timeOut: Joi.string().required(),
  }),
};

/**
 * For Updating Single Attendance Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    employeeId: Joi.number().required(),
    subsidiaryId: Joi.number().optional(),
    employeeCode: Joi.string().optional(),
    comments: Joi.string().required(),
    attDate: Joi.date().optional(),
    attDateIn: Joi.date().required(),
    attDateOut: Joi.date().required(),
    timeIn: Joi.string().required(),
    timeOut: Joi.string().required(),
  }),
};

/**
 * For Getting Single Attendance Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Getting All Attendance Records
 */
const getAllItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortOrder: Joi.string().required(),
    pageSize: Joi.number().required(),
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
      from: Joi.date().allow('').optional(),
      to: Joi.date().allow('').optional(),
    })
  }),
};

/**
 * For Process All Attendance Records
 */
const processAllItem = {
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
    from: Joi.date().allow('').optional(),
    to: Joi.date().allow('').optional(),
  }),
};

/**
 * For Getting Single Attendance Records By Id in Params
 */
const getSingleItemByFilters = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    attDateIn: Joi.date().required(),
    employeeId: Joi.number().required(),
  })
};


/**
 * For Getting Attendance Dropdown data
 */
const getItemWihoutId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};

/**
 * For Deleting Single Attendance Records By Id in Params
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
  getItemWihoutId,
  getSingleItemByFilters,
  processAllItem
};

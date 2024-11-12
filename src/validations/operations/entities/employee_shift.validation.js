const Joi = require("joi");
/**
 * For Creating Single Leave Type Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
   
    subsidiaryId : Joi.number().required(),
    companyId : Joi.number().required(),
    subsidiaryId : Joi.number().required(),
    name : Joi.string().required(),
    shiftCode : Joi.string().required(),
    startTime : Joi.date().required(),
    endTime   : Joi.date().required(),
    workingdays : Joi.number().required(),
    lateIn : Joi.date().required(),
    lateOut : Joi.date().required(),
    halfDayStart: Joi.date().required(),
    halfDayEnd : Joi.date().required(),
    breakStartTime : Joi.date().required(),
    breakEndTime : Joi.date().required(),
    isOverTime : Joi.bool().required(),
    overStartTime : Joi.date().required(),
    interShifGap : Joi.string().required(),
    isIncludeInterShifGap : Joi.bool().required(),
    
  }),
};

/**
 * For Updating Single Leave Type Record
 */
const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().required(),
    subsidiaryId : Joi.number().required(),
    companyId : Joi.number().required(),
    subsidiaryId : Joi.number().required(),
    name : Joi.string().required(),
    shiftCode : Joi.string().required(),
    startTime : Joi.date().required(),
    endTime   : Joi.date().required(),
    workingdays : Joi.number().required(),
    lateIn : Joi.date().required(),
    lateOut : Joi.date().required(),
    halfDayStart: Joi.date().required(),
    halfDayEnd : Joi.date().required(),
    breakStartTime : Joi.date().required(),
    breakEndTime : Joi.date().required(),
    isOverTime : Joi.bool().required(),
    overStartTime : Joi.date().required(),
    interShifGap : Joi.string().required(),
    isIncludeInterShifGap : Joi.bool().required(),
    isActive: Joi.bool().optional(),
    createdBy:Joi.disallow(),
    createdAt: Joi.disallow(),
    updatedBy:Joi.disallow(),
    updatedAt: Joi.disallow()
   
  }),
};

/**
 * For Getting Single Leave Type Records By Id in Params
 */
const getSingleItem = {
  query: Joi.disallow(),
  params: Joi.object().keys({
    id: Joi.required()
  }),
  body: Joi.disallow()
};

/**
 * For Getting All Leave Type Records
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
 * For Getting Leave Type Dropdown data
 */
const getItemWihoutId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};

/**
 * For Deleting Single Leave Type Records By Id in Params
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
const Joi = require("joi");
/**
 * For Creating Single Leave Type Record
 */
const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
   
    subsidiaryId : Joi.number().required(),
    
    companyId : Joi.any().optional(),
    name : Joi.string().required(),
    shiftCode : Joi.string().required(),
    shiftType : Joi.number().required(),
    startTime : Joi.string().required(),
    endTime   : Joi.string().required(),
    workingdays : Joi.any().optional(),
    earlyIn : Joi.any().optional(),
    earlyOut : Joi.any().optional(),
    halfDayStart : Joi.any().optional(),
    halfDayEnd : Joi.any().optional(),
    breakTimeStart : Joi.any().optional(),
    breakTimeEnd: Joi.any().optional(),
    isOverTime: Joi.any().optional(),
    isIncludeInterShifGap : Joi.any().optional(),
    overTimeStart : Joi.any().optional(),
    interShiftGap : Joi.any().optional(),
    isActive : Joi.disallow(),
    updatedAt : Joi.disallow(),
    createdAt : Joi.disallow(),
    subs: Joi.disallow(),
    markAbsent:Joi.any().optional(),
    markHalfDay:Joi.any().optional(),
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
    workingdays : Joi.any().optional(),
    earlyIn : Joi.any().optional(),
    earlyOut : Joi.any().optional(),
    halfDayStart : Joi.any().optional(),
    halfDayEnd : Joi.any().optional(),
    breakTimeStart : Joi.any().optional(),
    breakTimeEnd: Joi.any().optional(),
    isOverTime: Joi.any().optional(),
    overTimeStart : Joi.any().optional(),
    interShiftGap : Joi.any().optional(),
    shiftType : Joi.any().optional(),
    isIncludeInterShifGap : Joi.any().optional(),
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
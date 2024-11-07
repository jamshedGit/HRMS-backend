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
    late_count_leave_deduction : Joi.number().required(),
    leave_typeId: Joi.number().required(),
    isEnable_att_integration : Joi.any().optional(),
    
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
    leave_typeId: Joi.number().required(),
    late_count_leave_deduction : Joi.number().required(),
    isEnable_att_integration : Joi.any().optional(),
    isActive: Joi.bool().optional(),
    createdBy:Joi.disallow(),
    createdAt: Joi.disallow(),
    updatedBy:Joi.disallow(),
    updatedAt: Joi.disallow(),
    t_leave_type: Joi.optional(),
    leavetype:Joi.optional(),
    subs:Joi.optional(),
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

const Joi = require("joi");

const createDept = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    deptId: Joi.disallow(),
    deptName: Joi.string().required(),
    deptCode: Joi.string().required(),
    parentDept: Joi.any().optional(),
    budgetStrength:Joi.number().required(),
    subsidiaryId:Joi.any().optional(),
    chkParent:Joi.any().optional(),
    // location: Joi.string().required(),
    // slug: Joi.string().required(),
    // createdBy: Joi.string().required(),
    // updatedBy: Joi.allow(),
  }),
};


module.exports = {
  createDept
  
};
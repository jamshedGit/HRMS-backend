
const Joi = require("joi");

const createEmployeeType = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeType: Joi.disallow(),
    employeeTypeCode: Joi.string().required(),
   
  }),
};


module.exports = {
    createEmployeeType
  
};
const Joi = require("joi");


const CreatePayroll_ProcessValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        payroll_groupId: Joi.number().allow(null),
        payroll_monthId: Joi.number(),
        subsidiaryId: Joi.number(),

  
    }),
};



module.exports = {
    CreatePayroll_ProcessValidation,

};
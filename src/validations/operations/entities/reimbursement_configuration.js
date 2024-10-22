const Joi = require("joi");


const CreateReimbursement_configurationValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        subsidiaryId: Joi.number(),
        payroll_groupId: Joi.number(),
        cycle_typeId: Joi.number(), 
     
      
  
    }),
};



module.exports = {
    CreateReimbursement_configurationValidation,

};
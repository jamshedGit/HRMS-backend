const Joi = require("joi");


const CreateReimbursement_claimValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        reimbursement_typeId: Joi.number(),
        employeeId: Joi.number(),
        date: Joi.date(), 
        amount: Joi.number(), 
        pay_in_payroll_forId: Joi.number(), 
        pay_slip_refId: Joi.number(), 
        reimbursement_configurationId: Joi.number(), 

  
    }),
};



module.exports = {
    CreateReimbursement_claimValidation,

};
const Joi = require("joi");


const CreateEmployee_loan_requestValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        loan_typeId: Joi.number(),
        monthly_installment: Joi.precision(2),
        applied_date: Joi.date(), 
        installment_start_date: Joi.date(), 
        total_installment: Joi.number(), 
        reason: Joi.string(), 

     

  
    }),
};



module.exports = {
    CreateEmployee_loan_requestValidation,

};
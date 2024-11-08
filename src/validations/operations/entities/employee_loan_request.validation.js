const Joi = require("joi");


const CreateEmployee_loan_requestValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        loan_typeId: Joi.number(),
        monthly_installment: Joi.number().precision(2) , // Ensures 2 decimal places
        applied_date: Joi.date(), 
        installment_start_date: Joi.date(), 
        total_installment: Joi.number(), 
        total_loan_amount:Joi.number(), 
        reason: Joi.string(), 

     

  
    }),
};



module.exports = {
    CreateEmployee_loan_requestValidation,

};
const Joi = require("joi");


const createLoan_management_configurationValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        subsidiary: Joi.number(),
        account: Joi.number(),
        installment_deduction_percentage: Joi.number().precision(2).required(), 
        human_resource_role: Joi.number(),
        emp_loan_account: Joi.number(),
        installment_deduction_basis_type: Joi.number(),
        // loan_type: Joi.number(),
        // max_loan_amount: Joi.number(),
        // salary_count: Joi.number(),
    }),
};



module.exports = {
    createLoan_management_configurationValidation,

};
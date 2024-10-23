const Joi = require("joi");


const CreateAccrue_gratuity_configurationValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        subsidiaryId: Joi.number(),
        graduity_expense_accountId: Joi.number(),
        graduity_payable_accountId: Joi.number(), 
        bank_cash_accountId: Joi.number(),
      
  
    }),
};



module.exports = {
    CreateAccrue_gratuity_configurationValidation,

};
const Joi = require("joi");

const createEarningTranValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
               
        subsidiaryId: Joi.number(),
        compensation_benefits_Id : Joi.number(),
        earning_deduction_id : Joi.number(),
        transactionType : Joi.string(),
        calculation_type : Joi.string(),
        factorValue : Joi.number(),
        isPartOfGrossSalary : Joi.boolean(),  
    }),
};



module.exports = {
    createEarningTranValidation,

};
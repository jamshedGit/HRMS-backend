const Joi = require("joi");

const createDeductionValidation = {

    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({ 
        deductionCode: Joi.any().optional(),
        deductionName: Joi.string().trim(),
        linkedAttendance: Joi.boolean(),
        loan: Joi.boolean(),
        // mappedDeduction: Joi.string(),
        account: Joi.any().optional(),
        subsidiaryId: Joi.any().optional(),
        companyId: Joi.any().optional(),
        Id: Joi.any().optional(),
    }),
};



module.exports = {
    createDeductionValidation,

};
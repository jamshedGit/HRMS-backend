const Joi = require("joi");

const createDeductionValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        deductionCode: Joi.any().optional(),
        deductionName: Joi.string(),
        linkedAttendance: Joi.boolean(),
        loan: Joi.boolean(),
        mappedDeduction: Joi.string(),
        account: Joi.any().optional(),
    }),
};



module.exports = {
    createDeductionValidation,

};
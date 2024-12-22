const Joi = require("joi");

const createEarningValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        earningCode: Joi.string().optional(), 
        earningName: Joi.string(),
        linkedAttendance: Joi.boolean(),
        isTaxable: Joi.boolean(),
        mappedAllowance: Joi.any().optional(),
        account: Joi.any().optional(),
        subsidiaryId: Joi.any().optional(),
        companyId: Joi.any().optional(),
    }),
};

module.exports = {
    createEarningValidation,

};
const Joi = require("joi");

const createEarningValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        
        earningCode: Joi.string(),
        earningName: Joi.string(),
        linkedAttendance: Joi.boolean(),
        isTaxable: Joi.boolean(),
        mappedAllowance: Joi.string(),
        account: Joi.string(),
    }),
};



module.exports = {
    createEarningValidation,

};
const Joi = require("joi");

const createFormValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        code: Joi.string(),
        name: Joi.string(),
        linkedAttendance: Joi.any().optional(),
        subsidiaryId: Joi.any().optional(),
        companyId: Joi.any().optional(),
        accountId: Joi.any().optional(),
    }),
};



module.exports = {
    createFormValidation,
};
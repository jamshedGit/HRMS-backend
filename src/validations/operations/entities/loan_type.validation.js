const Joi = require("joi");

const createFormValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
       code: Joi.string(),
        name: Joi.string(),
        linkedAttendance: Joi.boolean(),
        mapped: Joi.string(),
        account: Joi.string(),
    }),
};



module.exports = {
    createFormValidation,
};
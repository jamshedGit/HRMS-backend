const Joi = require("joi");

const createExitValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Code: Joi.string(),
        Name: Joi.string(),
    }),
};



module.exports = {
    createExitValidation,

};
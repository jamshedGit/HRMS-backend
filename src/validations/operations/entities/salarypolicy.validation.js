const Joi = require("joi");


const createSalarypolicyValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        divisor: Joi.number(),
        multiplier: Joi.number(),
        type: Joi.string(),
        value: Joi.number(),
    }),
};



module.exports = {
    createSalarypolicyValidation,

};
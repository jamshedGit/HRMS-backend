const Joi = require("joi");

const createReligionValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        religionName: Joi.string(),
        religionCode: Joi.string(),
    }),
};


module.exports = {
    createReligionValidation
    
};
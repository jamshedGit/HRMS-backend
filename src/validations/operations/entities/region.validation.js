const Joi = require("joi");

const createRegionValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id: Joi.number(),
        regionName: Joi.string(),
        regionCode: Joi.string(),
    }),
};


module.exports = {
    createRegionValidation
    
};
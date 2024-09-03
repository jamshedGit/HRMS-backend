const Joi = require("joi");

const createDesignationValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        designationName: Joi.string(),
        designationCode: Joi.string(),
    }),
};


module.exports = {
    createDesignationValidation
    
};
const Joi = require("joi");


const createGratuity_configurationValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        subsidiaryId: Joi.number(),
        contract_typeId: Joi.number(),
        gratuity_fraction: Joi.number(), 
        num_of_days: Joi.number(),
        min_year: Joi.number(),
        max_year: Joi.number(),
        basis_of_gratuityId: Joi.number(),
  
    }),
};



module.exports = {
    createGratuity_configurationValidation,

};
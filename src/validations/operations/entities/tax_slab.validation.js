const Joi = require("joi");


const createTax_slabValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        from_amount: Joi.number(),
        to_amount: Joi.number(),
        percentage: Joi.number().precision(2).required(), 
        fixed_amount: Joi.number(),
    }),
};



module.exports = {
    createTax_slabValidation,

};
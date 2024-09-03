const Joi = require("joi");

const createExchangeRateValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        
        subsidiaryId :Joi.number(),
        base_currency_id :Joi.number(),
        currency_to_convert_id :Joi.number(),
        exchange_rate :Joi.number(),
        effective_date :Joi.date(),
    }),
};



module.exports = {
    createExchangeRateValidation,

};
const Joi = require("joi");


const createholidaysValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id:'',
        subsidiaryId: Joi.number(),
        name: Joi.string(),
        religionId: Joi.number().allow(null), 
        from_date: Joi.date(),
        to_date: Joi.date(),
        number_of_days: Joi.number(),
        holiday_typeId: Joi.number(),
        companyId:Joi.number(),
  
    }),
};



module.exports = {
    createholidaysValidation,

};
const Joi = require("joi");

const createSkillsValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        employeeId : Joi.number(),
        skill : Joi.string(),
        description : Joi.string(),
        ratingScale:Joi.number(),
        startDate : Joi.date(),
        endDate : Joi.date(),
       
    }),
};



module.exports = {
    createSkillsValidation,

};
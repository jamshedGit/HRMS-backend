const Joi = require("joi");

const createExperienceValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        employeeId : Joi.number(),
        companyName: Joi.string(),
        positionHeld: Joi.string(),
        countryId : Joi.number(),
        cityId : Joi.number(),
        startDate : Joi.date(),
        endDate : Joi.date(),
    }),
};



module.exports = {
    createExperienceValidation,

};
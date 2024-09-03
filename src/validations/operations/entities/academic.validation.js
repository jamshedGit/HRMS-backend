const Joi = require("joi");

const createAcademicValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        employeeId : Joi.number(),
        degreeId : Joi.number(),
        institutionId : Joi.number(),
        countryId : Joi.number(),
        cityId : Joi.number(),
        startDate : Joi.date(),
        endDate : Joi.date(),
        gpa : Joi.number(),
        statusId : Joi.number(),
        attachment : Joi.string(),
    }),
};



module.exports = {
    createAcademicValidation,

};
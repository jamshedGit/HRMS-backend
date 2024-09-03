const Joi = require("joi");

const createStoppageAllowanceValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        earning_deduction_type: Joi.string(),
        earning_deduction_Id: Joi.number(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        remarks: Joi.string(),
    }),
};



module.exports = {
    createStoppageAllowanceValidation,
};
const Joi = require("joi");

const createContactValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        relation: Joi.number(),
        relation_name: Joi.string(),
        employeeId: Joi.number(),
        contactNo: Joi.string(),

    }),
};



module.exports = {
    createContactValidation,

};
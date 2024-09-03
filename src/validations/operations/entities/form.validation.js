const Joi = require("joi");

const createForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        formName: Joi.string(),
        formCode: Joi.string(),
        parentFormID: Joi.any().optional(),
        level: Joi.number(),
        Id: Joi.any().optional(),
    }),
};


module.exports = {
    createForm
};
const Joi = require("joi");

const createForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        formName: Joi.string().trim(),
        formCode: Joi.string().trim(),
        parentFormID: Joi.any().optional(),
        level: Joi.number(),
        Id: Joi.any().optional(),
        isActive:Joi.boolean(),
    }),
};

const updateForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        formName: Joi.string().trim(),
        formCode: Joi.string().trim(),
        parentFormID: Joi.any().optional(),
        level: Joi.number(),
        Id: Joi.any().optional(),
        isActive:Joi.boolean(),
    }),
};

module.exports = {
    createForm,updateForm
};
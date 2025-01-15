const Joi = require("joi");


const createUser = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id: '',
        email: Joi.string(),
        password: Joi.string().trim(),
        supervisedbyId: Joi.number(),
        allowUserCreation: Joi.boolean(),
        companyId: Joi.number().allow(null),
        subsidiaryId: Joi.any(),

        employeeIdMapping: Joi.number().allow(null),
        deactiveflag: Joi.boolean(),
        roleId: Joi.number(),
        isActive: Joi.boolean(),


    }),
};



module.exports = {
    createUser,

};
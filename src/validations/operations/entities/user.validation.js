const Joi = require("joi");


const createUser = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id: '',
        email: Joi.string().trim(),
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

const updateUser = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id: Joi.number(),
        email: Joi.string().trim(),
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


const resetPassword = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
    
        email: Joi.string().trim(),
        currentPassword: Joi.string().trim(),
        password: Joi.string().trim(),
        companyId: Joi.number().allow(null),
        subsidiaryId: Joi.number().allow(null),

    }),
};
module.exports = {
    createUser,updateUser,resetPassword

};
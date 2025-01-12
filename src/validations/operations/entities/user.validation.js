const Joi = require("joi");


const createUser = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Id: '',
        email: Joi.string(),
        password: Joi.string(),
        supervisedbyId: Joi.number(),
        allowUserCreation: Joi.number(),
        companyId: Joi.number().allow(null),
        subsidiaryId: Joi.any(),

        employeeIdMapping: Joi.number().allow(null),
        employeeName: Joi.string(),
        deactiveflag: Joi.number(),
        roleId: Joi.number(),
        isActive: Joi.number(),


    }),
};



module.exports = {
    createUser,

};
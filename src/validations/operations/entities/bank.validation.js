const Joi = require("joi");

const createBankValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Name: Joi.string(),
    }),
};

const createBranchValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        Name: Joi.string(),
        BankId: Joi.number(),
        branchCode: Joi.string(),
        countryId: Joi.number(),
        cityId: Joi.number(),
        phone: Joi.string(),
        fax: Joi.string(),
        email: Joi.string(),
        contactPerson: Joi.string(),
        address: Joi.string(),
        accOpeningDate: Joi.date(),
        accNoForSalary: Joi.any().optional(),
        accNoForPF:Joi.any().optional(),
        accNoForGrad: Joi.any().optional(),
    }),
};


module.exports = {
    createBankValidation,
    createBranchValidation
};
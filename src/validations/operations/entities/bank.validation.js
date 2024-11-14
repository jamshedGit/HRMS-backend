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
        phone: Joi.any().optional(),
        fax: Joi.any().optional(),
        email: Joi.any().optional(),
        contactPerson:Joi.any().optional(),
        address: Joi.any().optional(),
        accOpeningDate: Joi.any().optional(),
        accNoForSalary: Joi.any().optional(),
        accNoForPF:Joi.any().optional(),
        accNoForGrad: Joi.any().optional(),
    }),
};


module.exports = {
    createBankValidation,
    createBranchValidation
};
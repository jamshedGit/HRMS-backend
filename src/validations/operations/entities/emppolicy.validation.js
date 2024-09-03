const Joi = require("joi");

const createEmpPolicyValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        baseCurrencyPolicyId: Joi.number(),
        subsdiaryId: Joi.number(),
        isEmployeeCodeGenerationAuto: Joi.boolean(),
        retirementAgeMale: Joi.number(),
        retirementAgeFemale: Joi.number(),
        minimumAge: Joi.number(),
        maximumAge: Joi.number(),
        pictureSizeLimit: Joi.number(),
        pictureFilesSupport: Joi.string(),
        documentSizeLimit: Joi.number(),
        documentFilesSupport: Joi.string(),
        empPictureIsMandatory: Joi.boolean(),
        probationPolicyInMonth: Joi.number(),
        contractualPolicyInMonth: Joi.number(),
        currencyId: Joi.number(),
        policyName: Joi.string(),
        code: Joi.string(),
        
        

    }),
};


module.exports = {
    createEmpPolicyValidation

};
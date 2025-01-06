const Joi = require("joi");

const createEmpPolicyValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        baseCurrencyPolicyId: Joi.number(),
        subsidiaryId: Joi.number(),
        isEmployeeCodeGenerationAuto: Joi.boolean(),
        retirementAgeMale: Joi.number(),
        retirementAgeFemale: Joi.number(),
        minimumAge: Joi.number().optional().allow(''),
        maximumAge: Joi.number().optional().allow(''),
        pictureSizeLimit: Joi.number().optional().allow(''),
        pictureFilesSupport: Joi.string().optional().allow(''),
        documentSizeLimit: Joi.number().optional().allow(''),
        documentFilesSupport: Joi.string().optional().allow(''),
        empPictureIsMandatory: Joi.boolean().optional().allow(''),
        probationPolicyInMonth: Joi.number(),
        contractualPolicyInMonth: Joi.number(),
        currencyId: Joi.number(),
        code: Joi.string(),
        codePrefix:Joi.string(),
        
        

    }),
};


module.exports = {
    createEmpPolicyValidation

};
const Joi = require("joi");

const createCompensationBenefitValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({

        subsidiaryId: Joi.number(),
       
        gradeId: Joi.number(),
        employeeTypeId : Joi.number(),
        currencyId : Joi.number(),
        salaryMethod : Joi.string(),
        basicFactor: Joi.number(),
        calculation_type : Joi.string(),
        factor : Joi.number(),
        partOfGrossSalary : Joi.boolean(),
        earningId : Joi.number(),
        deductionId : Joi.number(),
        gratuity_member : Joi.boolean(),
        overtime_allowance : Joi.boolean(),
        shift_allowance : Joi.boolean(),
        regularity_allowance : Joi.boolean(),
        punctuality_allowance : Joi.boolean(),
        pf_member : Joi.boolean(),
        eobi_member : Joi.boolean(),
        social_security_member : Joi.boolean(),
        pension_member : Joi.boolean(),

    }),
};



module.exports = {
    createCompensationBenefitValidation,

};
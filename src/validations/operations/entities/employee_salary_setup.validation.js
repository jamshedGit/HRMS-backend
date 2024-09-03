const Joi = require("joi");

const createEmployeeSalarySetupValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({

        employeeId: Joi.number(),
        currencyId: Joi.number(),
        grossSalary: Joi.number(),
        basicSalary: Joi.number(),
        gratuity_member: Joi.any().optional(),
        gratuity_startDate: Joi.any().optional(),
        overtime_allowance: Joi.any().optional(),
        shift_allowance: Joi.any().optional(),
        regularity_allowance: Joi.any().optional(),
        punctuality_allowance: Joi.any().optional(),
        pf_member: Joi.any().optional(),
        pf_reg_date: Joi.any().optional(),
        pf_accNo: Joi.any().optional(),
        eobi_member: Joi.any().optional(),
        eobi_reg_date: Joi.any().optional(),
        eobi_accNo: Joi.any().optional(),
        social_security_member: Joi.any().optional(),
        social_security_reg_date: Joi.any().optional(),
        social_security_accNo: Joi.any().optional(),
        pension_member: Joi.any().optional(),
        pension_reg_date: Joi.any().optional(),
        pension_accNo: Joi.any().optional(),
        profit_member: Joi.any().optional(),
        emp_bankId: Joi.any().optional(),
        emp_bank_branchId: Joi.any().optional(),
        emp_bank_accountTitle: Joi.any().optional(),
        emp_bank_accNo:Joi.any().optional(),
        payment_mode_Id: Joi.any().optional(),
        company_bankId: Joi.any().optional(),
        company_branchId: Joi.any().optional(),
        company_from_accNo: Joi.any().optional(),
    }),
};



module.exports = {
    createEmployeeSalarySetupValidation,

};
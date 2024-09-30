const Joi = require("joi");

const createEmployeeSalarySetupValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
    employeeId: Joi.number(),
    reviewDate: Joi.any().optional(),
    old_grossSalary : Joi.double(),
    new_grossSalary: Joi.any().optional(),
    old_basicSalary : Joi.any().optional(),
    new_basicSalary: Joi.any().optional(),
    old_payrollGroupId :  Joi.any().optional(),
    new_payrollGroupId: Joi.any().optional(),
    old_designationId: Joi.any().optional(),
    new_designationId: Joi.any().optional(),
    old_employeeTypeId : Joi.any().optional(),
    new_employeeTypeId: Joi.any().optional(),
    }),
};



module.exports = {
    createEmployeeSalarySetupValidation,

};
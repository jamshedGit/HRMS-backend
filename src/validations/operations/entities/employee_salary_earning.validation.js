const Joi = require("joi");

const createEmployeeSalaryEarningValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({

       
        employeeId: Joi.number(),
        // currencyId: Joi.number(),
        // grossSalary: Joi.number(),
        // basicSalary: Joi.number(),
        earning_deduction_id: Joi.number(),
        amount: Joi.number(),
        transactionType: Joi.string(),
        calculation_type: Joi.string(),
        factorValue: Joi.number(),
    }),
};



module.exports = {
    createEmployeeSalaryEarningValidation,

};
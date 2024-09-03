const Joi = require("joi");

const createEmployeeSalaryExpatriateValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        employeeId: Joi.number(),
        isVisaSponsorShipStatus : Joi.any().optional(),
        visaSponsorshipStatus : Joi.any().optional(),
        isAirTicket : Joi.any().optional(),
        airTicketAmount : Joi.any().optional(),
        remarks : Joi.any().optional(),
        countryId : Joi.any().optional(),
        cityId : Joi.any().optional(),
        noOfTicket : Joi.any().optional(),
        totalCost : Joi.any().optional(),
    }),
};



module.exports = {
    createEmployeeSalaryExpatriateValidation,

};
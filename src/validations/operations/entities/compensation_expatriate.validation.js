const Joi = require("joi");

const createCompensationExpValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
       
        gradeId : Joi.number(),
        employeeTypeId : Joi.number(),
        currencyId: Joi.number(),
        nationalityId : Joi.number(),
        isVisaSponsorShipStatus : Joi.any().optional(),
        visaSponsorshipStatus : Joi.any().optional(),
        isAirTicket : Joi.any().optional(),
        airTicketAmount : Joi.any().optional(),
        remarks : Joi.any().optional(),
        isExitFees: Joi.any().optional(),
        noOfFamilyMembers: Joi.any().optional(),
        noOfTicket : Joi.any().optional(),
        totalCost : Joi.any().optional(),
    }),
};



module.exports = {
    createCompensationExpValidation,

};
const Joi = require("joi");

const createEmployeeTransfer = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
       
        transferCategory: Joi.any().optional(),
        employeeId: Joi.number(),
        transferType : Joi.string(),
        transferDate : Joi.date(),
        tillTransferDate: Joi.any().optional(),
        TranferDateTemporary : Joi.any().optional(),
        IsTemporaryTransfer: Joi.any().optional(),
        transferRemarks : Joi.any().optional(),
        employeeTypeId : Joi.any().optional(),
        companyId : Joi.any().optional(),
        subsidiaryId : Joi.any().optional(),
        reportTo: Joi.any().optional(),
        departmentId : Joi.any().optional(),
        subDempartmentId : Joi.any().optional(),
        gradeId : Joi.any().optional(),
        teamId : Joi.any().optional(),
        designationId : Joi.any().optional(),
        locationId : Joi.any().optional(),
        regionId : Joi.any().optional(),
        cityId : Joi.any().optional(),
        countryId : Joi.any().optional(),
        payrollGroupId : Joi.any().optional(),
        defaultShiftId : Joi.any().optional(),
      
    }),
};



module.exports = {
    createEmployeeTransfer,

};
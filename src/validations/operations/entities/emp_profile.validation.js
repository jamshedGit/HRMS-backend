const Joi = require("joi");

const createEmp_profileValidation = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        firstName: Joi.string(),
        subsidiaryId : Joi.number(),
        lastName: Joi.string(),
        middleName: Joi.string(),
        title: Joi.string(),
        employeeCode: Joi.string(),
        profile_image: Joi.string(),
        nic_no: Joi.string(),
        passportNo: Joi.string(),
        maritalStatus: Joi.string(),
        gender: Joi.string(),
        nationality: Joi.string(),
        email_official: Joi.string(),
        email_personal: Joi.string(),
        phone_home: Joi.string(),
        phone_official: Joi.string(),
        phone_cell: Joi.string(),
        professional_summary: Joi.string(),
        additional_summary: Joi.string(),
        status: Joi.string(),
        departmentId: Joi.number(),
        designationId: Joi.number(),
        teamId: Joi.number(),
        payrollGroupId: Joi.number(),
        regionId: Joi.number(),
        religionId: Joi.number(),
        employeeTypeId: Joi.number(),
        locationId: Joi.number(),
        countryId: Joi.number(),
        cityId: Joi.number(),
        dateOfJoining: Joi.date(),
        dateOfConfirmation: Joi.date(),
        dateOfConfirmationDue: Joi.date(),
        dateOfConfirmationEnter: Joi.date(),
        dateOfContractExpiry: Joi.date(),
        defaultShiftId: Joi.number(),
        attendanceType: Joi.string(),
        dateOfBirth: Joi.date(),
        dateOfRetirement: Joi.date(),
        gradeId: Joi.number(),
        reportTo: Joi.number()
    }),
};


module.exports = {
    createEmp_profileValidation

};
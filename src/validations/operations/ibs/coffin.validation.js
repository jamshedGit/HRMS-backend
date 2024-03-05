const Joi = require("joi");

const createCoffinForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        id: Joi.disallow(),
        countryId: Joi.number().integer().allow(),
        cityId: Joi.number().integer().allow(),
        statusId: Joi.number().integer().allow(),
        ibfId: Joi.number().integer().allow(),
        mfId: Joi.number().integer().allow(),
        SN: Joi.number().integer().allow(),
        dateTime: Joi.string().required(),
        fullNameOfTheDeceased: Joi.string().required(),
        fatherNameOfTheDeceased: Joi.string().required(),
        surname: Joi.string().allow(''),
        cast: Joi.string().allow(''),
        religion: Joi.string().allow(''),
        nativePlace: Joi.string().allow(''),
        age: Joi.number().integer().allow(),
        gender: Joi.string().allow(''),
        dateTimeofDeath: Joi.string().allow(''),
        causeOfDeath: Joi.string().allow(''),
        placeOfDeath: Joi.string().allow(''),
        description: Joi.string().allow(''),
        reporterCnic: Joi.string().allow(''),
        reporterName: Joi.string().allow(''),
        reporterPhNo: Joi.string().allow(''),
    }),
};

const updateCoffinForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object()
        .keys({
            id: Joi.number().integer().required(),
            countryId: Joi.number().integer().allow(),
            cityId: Joi.number().integer().allow(),
            statusId: Joi.number().integer().allow(),
            ibfId: Joi.number().integer().allow(),
            mfId: Joi.number().integer().allow(),
            SN: Joi.number().integer().allow(),
            dateTime: Joi.string().required(),
            fullNameOfTheDeceased: Joi.string().required(),
            fatherNameOfTheDeceased: Joi.string().required(),
            surname: Joi.string().allow(''),
            cast: Joi.string().allow(''),
            religion: Joi.string().allow(''),
            nativePlace: Joi.string().allow(''),
            age: Joi.number().integer().allow(),
            gender: Joi.string().allow(''),
            dateTimeofDeath: Joi.string().allow(''),
            causeOfDeath: Joi.string().allow(''),
            placeOfDeath: Joi.string().allow(''),
            description: Joi.string().allow(''),
            reporterCnic: Joi.string().allow(''),
            reporterName: Joi.string().allow(''),
            reporterPhNo: Joi.string().allow(''),
        })
        .min(1),
};

const getCoffinForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        id: Joi.number().integer().required(),

    }),
};

const getCoffinForms = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        filter: Joi.allow(),
        sortOrder: Joi.string(),
        pageSize: Joi.number().integer(),
        pageNumber: Joi.number().integer(),
        // sortBy: Joi.string(),
        // limit: Joi.number().integer(),
        // page: Joi.number().integer(),
    }),
};

const deleteCoffinFormById = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
};


module.exports = {
    createCoffinForm,
    updateCoffinForm,
    getCoffinForm,
    getCoffinForms,
    deleteCoffinFormById
};

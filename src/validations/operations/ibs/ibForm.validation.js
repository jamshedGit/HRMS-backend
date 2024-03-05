const Joi = require("joi");

const getIbForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        id: Joi.number().integer(),

    }),
};

const getIbForms = {
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

  const deleteIbFormById = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        id: Joi.number().integer(),
    }),
};

const getIbsReportByYear = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        year: Joi.number().integer(),

    }),
};


module.exports = {
    getIbForm,
    getIbForms,
    deleteIbFormById,
    getIbsReportByYear
};

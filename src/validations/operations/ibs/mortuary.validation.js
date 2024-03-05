const Joi = require("joi");

const getMortuaryForm = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        id: Joi.number().integer(),

    }),
};

const getMortuaryForms = {
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

  const deleteMortuaryFormById = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        id: Joi.number().integer(),
    }),
};


module.exports = {
    getMortuaryForm,
    getMortuaryForms,
    deleteMortuaryFormById
};

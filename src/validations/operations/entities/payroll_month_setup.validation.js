const Joi = require("joi");

const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    month: Joi.number().required(),
    year : Joi.number().required(),
    month_days : Joi.number().required(),
    shortFormat : Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
   
  }),
};

module.exports = {
  createItem
};

const Joi = require("joi");

const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    // location: Joi.string().required(),
    // slug: Joi.string().required(),
    // createdBy: Joi.string().required(),
    // updatedBy: Joi.allow(),
  }),
};

module.exports = {
  createItem
};

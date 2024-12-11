const Joi = require("joi");

const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: '',
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    subsidiaryId: Joi.number().required(),
   
  }),
};

module.exports = {
  createItem
};

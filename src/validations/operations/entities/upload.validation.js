const Joi = require("joi");


const downloadFiles = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    type: Joi.string().optional(),
  }),
};

module.exports = {
  downloadFiles,

};
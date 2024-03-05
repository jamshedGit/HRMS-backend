const Joi = require("joi");
// const { password, objectId } = require('./custom.validation');

const createTransactionMaster = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    transactionDate: Joi.date().required(),
    narration: Joi.string().required(),
    receiptNo: Joi.string().required(),
  }),
};

const getTransactionMasters = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransactionMaster = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateTransactionMaster = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      transactionDate: Joi.date().allow(),
      narration: Joi.string().allow(),
      receiptNo: Joi.string().allow(),
    })
    .min(1),
};

const deleteTransactionMaster = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createTransactionMaster,
  getTransactionMasters,
  getTransactionMaster,
  updateTransactionMaster,
  deleteTransactionMaster,
};

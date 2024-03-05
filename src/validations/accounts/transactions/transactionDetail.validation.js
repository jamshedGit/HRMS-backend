const Joi = require("joi");

const createTransactionDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),  
    types: Joi.string().required(),
    price: Joi.string().required(),
    unit: Joi.string().required(),
    transactionMasterId: Joi.number().integer().required(),  
    driverId: Joi.number().integer().required(),
    incidentId: Joi.number().integer().required(),
    vehicleId: Joi.number().integer().required(),
  }),
};

const getTransactionDetails = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransactionDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateTransactionDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      types: Joi.string().allow(),
      price: Joi.string().allow(),
      unit: Joi.string().allow(),
      transactionMasterId: Joi.number().integer().allow(),  
      driverId: Joi.number().integer().allow(),
      incidentId: Joi.number().integer().allow(),
      vehicleId: Joi.number().integer().allow(),
    })
    .min(1),
};
const deleteTransactionDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createTransactionDetail,
  getTransactionDetails,
  getTransactionDetail,
  updateTransactionDetail,
  deleteTransactionDetail,
};

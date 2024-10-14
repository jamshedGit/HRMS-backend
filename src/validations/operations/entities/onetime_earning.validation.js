const Joi = require("joi");

const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    employeeId : Joi.disallow(),
    earning_Id : Joi.disallow(),
    amount: Joi.disallow(),
    month : Joi.disallow(),
    remarks : Joi.disallow(),
    isActive: Joi.any().optional(),
    createdBy: Joi.any().optional(),
    createdAt: Joi.any().optional(),
    updatedAt: Joi.any().optional(),
    updatedBy: Joi.any().optional(),
    Id: Joi.any().optional(),
    transactionType: Joi.disallow(),
    earningObjList: Joi.array().optional()
  }),
};

const getItems = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const updateItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      name: Joi.string().allow(),
      isPriceList: Joi.boolean().allow(),
      //   location: Joi.string().allow(),
      //   slug: Joi.string().allow(),
      //   parentName: Joi.string().allow(),
      //   isResourceShow: Joi.boolean().allow(),
    })
    .min(1),
};

const deleteItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};

const Joi = require("joi");

const createReceipt = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    name: Joi.string().required(),
    isPriceList: Joi.boolean().required(),
    // location: Joi.string().required(),
    // slug: Joi.string().required(),
    // createdBy: Joi.string().required(),
    // updatedBy: Joi.allow(),
  }),
};

const getReceipts = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReceipt = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const getMaxNoFromReceipt = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    bookingNo: Joi.string().required(),
  }),
};


const updateReceipt = {
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

const deleteReceipt = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const getDonationReceiptByBookNo = {
    query: Joi.disallow(),
    params: Joi.disallow(),
    body: Joi.object().keys({
        bookNo: Joi.string(),
        cityId: Joi.number().integer(),
        centerId: Joi.number().integer(),
        subCenterId: Joi.number().integer(),
        dateFrom: Joi.string(),
        dateTo: Joi.string(),
    }),
};

module.exports = {
    createReceipt,
    getReceipts,
    getReceipt,
    updateReceipt,
    deleteReceipt,
    getDonationReceiptByBookNo,
    getMaxNoFromReceipt
};

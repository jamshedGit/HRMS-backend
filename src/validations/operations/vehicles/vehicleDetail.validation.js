const Joi = require("joi");

const createVehicleDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.disallow(),
    name: Joi.string().allow(""),
    regNo: Joi.string().required(),   
    engineNo: Joi.string().allow(""),
    engineCapacity: Joi.string().allow(""),
    registerCity: Joi.string().allow(""),
    chasis: Joi.string().allow(""),
    milleage: Joi.number().integer().allow(""),
    year: Joi.number().integer().required(), 
    make: Joi.string().allow(""),
    model: Joi.string().allow(""),
    color: Joi.string().allow(""),
    fuelType: Joi.string().allow(""),
    transmission: Joi.string().allow(""),
    status: Joi.string().required(),
    centerId: Joi.number().integer().required(),
    vehicleCategoryId: Joi.number().integer().required(),
    driverId: Joi.number().integer().allow(),
    subCenterId: Joi.number().integer().required()
  }),
};

const getVehicleDetails = {
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

const getVehicleDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const getVehicleDetailbyCenterId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    centerId: Joi.number().integer(),
    subCenterId: Joi.number().integer(),
    filter: Joi.allow(),
    sortOrder: Joi.string(),
    pageSize: Joi.number().integer(),
    pageNumber: Joi.number().integer(),
  }),
};

const updateVehicleDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      name: Joi.string().allow(""),
      regNo: Joi.string().allow(),
      engineNo: Joi.string().allow(""),    
      engineCapacity: Joi.string().allow(""),
      registerCity: Joi.string().allow(""),
      chasis: Joi.string().allow(""),
      milleage: Joi.number().integer().allow(""),
      year: Joi.number().integer().allow(),   
      make: Joi.string().allow(""),
      model: Joi.string().allow(""),
      color: Joi.string().allow(""),
      fuelType: Joi.string().allow(""),
      transmission: Joi.string().allow(""),
      status: Joi.string().allow(),
      centerId: Joi.number().integer().allow(),
      vehicleCategoryId: Joi.number().integer().allow(),
      driverId: Joi.number().integer().allow(),
      oldDriverId: Joi.number().integer().allow(),
      subCenterId: Joi.number().integer().allow()
    })
    .min(1),
};

const updateVehicleStatusDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object()
    .keys({
      id: Joi.number().integer(),
      available: Joi.boolean().allow().required(),
      offDuty: Joi.boolean().allow().required()
    })
    .min(1),
};
const deleteVehicleDetail = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

module.exports = {
  createVehicleDetail,
  getVehicleDetails,
  getVehicleDetail,
  updateVehicleDetail,
  updateVehicleStatusDetail,
  deleteVehicleDetail,
  getVehicleDetailbyCenterId
};

const Joi = require('joi');

const getRolesMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getResourcesMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getCountriesMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getBanksMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getDeptMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getAllEmployees = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getFormMenuMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    Id: Joi.number().integer(),
    tableName: Joi.string(),
    prefix:Joi.string(),
    text: Joi.optional()
  }),
  
};

const getAllLeaveType = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
}

const getAlarmTimesMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getCitiesMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    countryId: Joi.number().integer().required()
  }),
};

const getCentersMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getSubCentersMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    centerId: Joi.number().integer().required()
  }),
};
const getCentersMasterDataByCityId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    cityId: Joi.number().integer().required()
  }),
};


const getDriversMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    subCenterId: Joi.number().integer().required(),
    available: Joi.boolean().allow().required(),
    notAvailable: Joi.boolean().allow().required()
  }),
};

const getVehiclesCategoryMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow()
};
const getVehiclesDashboardMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    cityId: Joi.number().integer().required(),
    centerId: Joi.number().integer(),
    subCenterId: Joi.number().integer(),
    alarmTimeId: Joi.number().integer()
  }),
};

const getIncidentTypeMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getIncidentSeverityMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.disallow(),
};

const getStatusMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    // ibs: Joi.boolean().allow().required()
    filter: Joi.allow(),
  }),
};

const getVehiclesByCenterIdMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    centerId: Joi.number().integer().required(),
    subCenterId: Joi.number().integer().allow(),
    available: Joi.boolean().allow().required(),
    inProgress: Joi.boolean().allow().required()
  }),
};


const getNearByCenters = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    lat: Joi.number().required(),
    long: Joi.number().required(),
  }),
};

const getHospitalsMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    cityId: Joi.number().integer().required()
  }),
};

const getPoliceStationsMasterData = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    cityId: Joi.number().integer().required()
  }),
};

const getEmpSalaryRevisionByEmpId = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    employeeId: Joi.number().integer().required()
  }),
};


module.exports = {
  getRolesMasterData,
  getResourcesMasterData,
  getCountriesMasterData,
  getAlarmTimesMasterData,
  getCitiesMasterData,
  getCentersMasterData,
  getSubCentersMasterData,
  getCentersMasterDataByCityId,
  getDriversMasterData,
  getVehiclesCategoryMasterData,
  getIncidentTypeMasterData,
  getIncidentSeverityMasterData,
  getVehiclesByCenterIdMasterData,
  getNearByCenters,
  getStatusMasterData,
  getVehiclesDashboardMasterData,
  getHospitalsMasterData,
  getPoliceStationsMasterData,
  getBanksMasterData,
  getDeptMasterData,
  getFormMenuMasterData,
  getAllEmployees,
  getEmpSalaryRevisionByEmpId,
  getAllLeaveType
};

const { UserModel, RoleModel, ResourceModel, CountryModel, CityModel, CenterModel, SubCenterModel, VehicleDetailModel, VehicleCategoryModel, IncidentTypeModel, IncidentSeverityModel, StatusTypeModel, AlarmTimeModel, HospitalModel, PoliceStationModel } = require('../../models');
const { getDdlItems, getAlarmTimesItems } = require('../../utils/common');
const { DDL_FIELD_NAMES } = require('../../utils/constants');
const { getRoleById } = require('./role.service');
const Sequelize = require('sequelize');
const sequelize = require('../../config/db')
const Op = Sequelize.Op;

const getRolesMasterData = async (roleId) => {
  var userRole = await getRoleById(roleId);
  userRole = userRole.slug == 'super-admin' ? true : false;

  let whereClause;
  if (userRole !== true) {
    whereClause = {
      slug: { [Op.not]: ['super-admin', 'admin'] },
    };
  }
  const rolesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await RoleModel.findAll({
    where: { isActive: true },
    where: whereClause,
    attributes: ['id', 'name']
  }));
  return rolesMasterData
};

const getStatusMasterData = async (check) => {

  if (check.filter.normal) {

    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, normal: check.filter.normal },
      attributes: ['id', 'name']
    }));
    return statusMasterData
    
  } 

  if (check.filter.ibf) {

    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, ibf: check.filter.ibf },
      attributes: ['id', 'name']
    }));
    return statusMasterData
    
  } 

  if (check.filter.mf) {
    
    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, mf: check.filter.mf },
      attributes: ['id', 'name']
    }));
    return statusMasterData

  } 

  if (check.filter.cf) {

    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, cf: check.filter.cf },
      attributes: ['id', 'name']
    }));
    return statusMasterData
    
  } 

};

const getResourcesMasterData = async () => {
  const resourcesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await ResourceModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return resourcesMasterData
};

const getCountriesMasterData = async () => {
  const countriesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await CountryModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return countriesMasterData
};

const getAlarmTimesMasterData = async () => {
  const alarmtimesMasterData = getAlarmTimesItems(DDL_FIELD_NAMES.alarmTime, await AlarmTimeModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'durationInMinutes']
  }));
  return alarmtimesMasterData
};

const getCitiesMasterData = async (countryId) => {
  const citiesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await CityModel.findAll({
    where: { isActive: true, countryId: countryId },
    attributes: ['id', 'name']
  }));
  return citiesMasterData
};

const getCentersMasterData_old = async () => {
  // const centersMasterData = getDdlItems(DDL_FIELD_NAMES.default, await CenterModel.findAll({
  //   where: { isActive: true },
  //   attributes: ['id','name']
  // }));
  const centersMasterData = await CenterModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name', 'latitude', 'longitude']
  });
  return centersMasterData
};

const getCentersMasterData = async () => {
  const centersMasterData = getDdlItems(DDL_FIELD_NAMES.default, await CenterModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return centersMasterData
};

const getSubCentersMasterData = async (centerId) => {
  const citiesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await SubCenterModel.findAll({
    where: { isActive: true, centerId: centerId },
    attributes: ['id', 'name']
  }));
  return citiesMasterData
};

const getCentersMasterDataByCityId = async (cityId) => {
  const centersMasterData = getDdlItems(DDL_FIELD_NAMES.default, await CenterModel.findAll({
    where: { isActive: true, cityId: cityId },
    attributes: ['id', 'name']
  }));
  return centersMasterData
};

const getDriversMasterData = async (subCenterId, available, notAvailable) => {

  if ((available == true) && (notAvailable == true)) {
    const driverRoleId = await RoleModel.findOne({
      where: { isActive: true, slug: 'driver' },
      attributes: ['id']
    });
    const driversMasterData = getDdlItems(DDL_FIELD_NAMES.driver, await UserModel.findAll({
      where: { roleId: driverRoleId.id, subCenterId: subCenterId, isActive: true },
      attributes: ['id', 'userName']
    }));
    return driversMasterData

  } else if (notAvailable) {

    const driverRoleId = await RoleModel.findOne({
      where: { isActive: true, slug: 'driver' },
      attributes: ['id']
    });
    const driversMasterData = getDdlItems(DDL_FIELD_NAMES.driver, await UserModel.findAll({
      where: { roleId: driverRoleId.id, subCenterId: subCenterId, isActive: true, status: 'Not Available' },
      attributes: ['id', 'userName']
    }));
    return driversMasterData

  } else if (available) {
    const driverRoleId = await RoleModel.findOne({
      where: { isActive: true, slug: 'driver' },
      attributes: ['id']
    });
    const driversMasterData = getDdlItems(DDL_FIELD_NAMES.driver, await UserModel.findAll({
      where: { roleId: driverRoleId.id, subCenterId: subCenterId, isActive: true, status: 'Available' },
      attributes: ['id', 'userName']
    }));
    return driversMasterData

  } else {
    return [];
  }
};

const getVehiclesByCenterIdMasterData = async (available, inProgress, filter) => {
  // console.log("subCenterId",filter.subCenterId);
  var checkSubCenterId = filter.subCenterId == '' ? false : true;
  var whereClause;
  if (checkSubCenterId !== false) {
    // console.log("where clause true")
    whereClause = {
      tempSubCenterId: filter.subCenterId
    };
  }

  if ((available == true) && (inProgress == true)) {
    const vehiclesMasterData = getDdlItems(DDL_FIELD_NAMES.vehicle, await VehicleDetailModel.findAll({
      where: [{ tempCenterId: filter.centerId, isActive: true }, whereClause],
      attributes: ['id', 'name', 'regNo']
    }));
    return vehiclesMasterData
  } else if (inProgress) {
    const vehiclesMasterData = getDdlItems(DDL_FIELD_NAMES.vehicle, await VehicleDetailModel.findAll({
      // where: { centerId: centerId, isActive: true, status: 'InProgress' },
      where: [{ tempCenterId: filter.centerId, isActive: true, status: 'InProgress' }, whereClause],
      attributes: ['id', 'name', 'regNo']
    }));
    return vehiclesMasterData
  } else if (available) {
    const vehiclesMasterData = getDdlItems(DDL_FIELD_NAMES.vehicle, await VehicleDetailModel.findAll({
      // where: { centerId: centerId, isActive: true, status: 'Available' },
      where: [{ tempCenterId: filter.centerId, isActive: true, status: 'Available' }, whereClause],
      attributes: ['id', 'name', 'regNo']
    }));
    return vehiclesMasterData

  } else {
    return [];
  }
};

const getVehiclesDashboardMasterData = async (req, filter) => {
  // Logic to be added here for dashboard API 
  // var caseQuery = ``;
  // if (filter.alarmTimeId) {
  //   var alarmTimeQuery = async (filter) => {
  //     let alarmTime = await AlarmTimeModel.findOne({
  //       where: { id: filter.alarmTimeId, isActive: true },
  //       attributes: ['durationInMinutes']
  //     });

  //     if (!alarmTime) {
  //       throw new ApiError(httpStatus.NOT_FOUND, "Alarm Time not found");
  //     }
  //     // console.log("minutes", alarmTime.durationInMinutes)
  //     caseQuery = `,CAST(
  //          CASE
  //            WHEN TL."start_time" IS NOT NULL AND TL."end_time" IS NOT NULL THEN 
  //              EXTRACT(EPOCH FROM (TL."end_time" - TL."start_time"))/60
  //            ELSE 
  //              EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - TL."start_time"))/60
  //            END AS INTEGER
  //        ) AS duration_In_Minutes,
  //        CASE
  //   WHEN EXTRACT(EPOCH FROM COALESCE(TL."end_time", CURRENT_TIMESTAMP) - TL."start_time")/60 > ${alarmTime.durationInMinutes} THEN 'red'
  //   ELSE 'blue'
  //        END AS timeStatus`
  //     return caseQuery
  //   }
  //   // console.log("alarmConsole", await alarmTimeQuery(filter))
  // }

  let whereClause;
  if (filter.subCenterId) {
    // If SubCenterId is present
    whereClause = `where VH."tempCenterId" = ${filter.centerId} and VH."tempSubCenterId" = ${filter.subCenterId}`
    // If alarmTimeId is present
    if (filter.alarmTimeId) {
      // caseQuery = await alarmTimeQuery(filter)
      // console.log("caseQuery", caseQuery)
      whereClause += ` AND TL."alarmTimeId" = ${filter.alarmTimeId}`
    }
  } else if (filter.centerId) {
    // If CenterId is present
    whereClause = `where VH."tempCenterId" = ${filter.centerId}`
    // If alarmTimeId is present
    if (filter.alarmTimeId) {
      // caseQuery = await alarmTimeQuery(filter)
      // console.log("caseQuery", caseQuery)
      whereClause += ` AND TL."alarmTimeId" = ${filter.alarmTimeId}`
    }
  } else {
    // If CityId is present
    let centersIds = await CenterModel.findAll({
      where: { countryId: req?.user?.countryId, cityId: filter.cityId, isActive: true },
      attributes: ['id']
    });
    let centerIds = centersIds.map((items) => items.id);
    whereClause = `where VH."tempCenterId" in(${centerIds})`
    // If alarmTimeId is present
    if (filter.alarmTimeId) {
      // caseQuery = await alarmTimeQuery(filter)
      // console.log("caseQuery", caseQuery)
      whereClause += `AND TL."alarmTimeId" = ${filter.alarmTimeId}`
    }
  }
  // console.log("caseQuery", caseQuery)
  let vehicles = await sequelize.query(`SELECT VH."id" as vehicleId, TL."tripLogId", VH."name",  VH."regNo", VH."status", 
                                        TL."start_time", TL."end_time", ATI."durationInMinutes" AS Assigned_Minutes,
                                        CAST(
                                        CASE
                                          WHEN TL."end_time" IS NOT NULL THEN 
                                          EXTRACT(EPOCH FROM (TL."end_time" - TL."start_time"))/60
                                          ELSE 
                                          EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - TL."start_time"))/60
                                          END AS INTEGER
                                        ) AS duration_Minutes,
                                        CASE
                                          WHEN EXTRACT(EPOCH FROM COALESCE(TL."end_time", CURRENT_TIMESTAMP) - TL."start_time")/60 > ATI."durationInMinutes" THEN 'late'
                                          ELSE null
                                                END AS timeStatus
                                      FROM public."T_VEHICLE_DETAILS" VH
                                      LEFT JOIN (
                                        SELECT DISTINCT ON ("vehicleId") "id" as "tripLogId",
                                          "vehicleId",
                                        "alarmTimeId",
                                          "startDateTime" as start_time, 
                                          "endDateTime"   as end_time
                                        FROM public."T_DRIVER_TRIPLOG"
                                        GROUP BY "tripLogId","vehicleId"
                                        ORDER BY "vehicleId", "startDateTime" DESC
                                      ) TL
                                      ON VH."id" = TL."vehicleId"
                                      LEFT JOIN public."T_ALARMTIME" ATI 
                                          ON ATI."id" = TL."alarmTimeId"
                                      ${whereClause}
                                      AND VH."isActive" = true
                                      AND VH."driverId" IS NOT NULL`);

  let standBy = [];
  let onDuty = [];
  let offDuty = [];

  vehicles[0].map((item) => {
    if (item.status == 'Available') {
      if (item.end_time == null) {
        item.reminder = 'No trip logs found hence no time available.'
      }
      delete item.start_time;
      standBy.push(item);
    }
    else if (item.status == 'InProgress') {
      delete item.end_time;
      onDuty.push(item);
    } else {
      offDuty.push(item);
    }
  })

  let returnObj = {
    standBy,
    onDuty,
    offDuty
  }
  return returnObj;

};

const getVehiclesCategoryMasterData = async () => {
  const vehiclesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await VehicleCategoryModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return vehiclesMasterData
};

const getIncidentTypeMasterData = async () => {
  const incidentTypeMasterData = getDdlItems(DDL_FIELD_NAMES.default, await IncidentTypeModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return incidentTypeMasterData
};

const getIncidentSeverityMasterData = async () => {
  const incidentSeverityMasterData = getDdlItems(DDL_FIELD_NAMES.default, await IncidentSeverityModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return incidentSeverityMasterData
};

const getHospitalsMasterData = async (cityId) => {
  const hospitalsMasterData = getDdlItems(DDL_FIELD_NAMES.default, await HospitalModel.findAll({
    where: { isActive: true, cityId: cityId },
    attributes: ['id', 'name']
  }));
  return hospitalsMasterData
};

const getPoliceStationsMasterData = async (cityId) => {
  const policeStationsMasterData = getDdlItems(DDL_FIELD_NAMES.default, await PoliceStationModel.findAll({
    where: { isActive: true, cityId: cityId },
    attributes: ['id', 'name']
  }));
  return policeStationsMasterData
};

// const getVehicleMakes = async () => {
//   const make = getDdlItems(DDL_FIELD_NAMES.make, await VehicleDetailsModel.find({ isDeleted: false }, { make: 1 }));
//   return make;
// };

// const getVehicleModels = async (makeId) => {
//   const model_data = await VehicleDetailsModel.find(
//     { 'model.isDeleted': false, _id: makeId },
//     { 'model._id': 1, 'model.modelName': 1 }
//   );
//   if (model_data.length > 0) {
//     const model_data_res = model_data[0].model;
//     model = getDdlItems(DDL_FIELD_NAMES.model, model_data_res);
//     return model;
//   } else {
//     return [];
//   }
// };

// const getVehicleVariants = async (makeId, modelId) => {
//   const variant_data = await VehicleDetailsModel.aggregate([
//     {
//       $match: {
//         _id: mongoose.Types.ObjectId(makeId),
//         isDeleted: false,
//       },
//     },
//     { $unwind: '$model' },
//     { $unwind: '$model.variant' },
//     {
//       $match: {
//         'model._id': mongoose.Types.ObjectId(modelId),
//         isDeleted: false,
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         _id: '$model.variant._id',
//         variant: '$model.variant.variantName',
//       },
//     },
//   ]);

//   if (variant_data.length > 0) {
//     variant = getDdlItems(DDL_FIELD_NAMES.variant, variant_data);
//     return variant;
//   } else {
//     return [];
//   }
// };

// const getVehicleVariantDetails = async (makeId, modelId, variantId) => {
//   const variant_Details = await VehicleDetailsModel.aggregate([
//     {
//       $match: {
//         _id: mongoose.Types.ObjectId(makeId),
//         isDeleted: false,
//       },
//     },
//     { $unwind: '$model' },
//     { $unwind: '$model.variant' },
//     {
//       $match: {
//         'model._id': mongoose.Types.ObjectId(modelId),
//         isDeleted: false,
//       },
//     },
//     {
//       $match: {
//         'model.variant._id': mongoose.Types.ObjectId(variantId),
//         isDeleted: false,
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         color: '$model.variant.color',
//         fuelType: '$model.variant.fuelType',
//       },
//     },
//   ]);

//   if (variant_Details.length > 0) {
//     return {
//       color: variant_Details[0].color.map((i) => ({ label: i, value: i })),
//       fuelType: variant_Details[0].fuelType.map((i) => ({ label: i, value: i })),
//     };
//   } else {
//     return {
//       color: [],
//       fuelType: [],
//     };
//   }
// };

// const getRoles = async () => {
//   const roles = getDdlItems(DDL_FIELD_NAMES.default, await RoleaccessModel.find({ isDeleted: false }, { name: 1 }));
//   return roles;
// };

// const getDealers = async () => {
//   const dealers = await DealerModel.find({ isDeleted: false }, { name: 1, location: 1 });
//   const mapped = getDdlItems(
//     DDL_FIELD_NAMES.default,
//     dealers.map((i) => ({ _id: i._id, name: i.name + ' - ' + i.location }))
//   );
//   return mapped;
// };

// const getInspectionTypes = async () => {
//   const inspectionType = getDdlItems(DDL_FIELD_NAMES.inspectionType, await SurveyModel.find({ isDeleted: false }, { inspectionType: 1 }));
//   return inspectionType;
// };

// const getInspectionGroups = async (inspectionTypeId) => {
//   const group_data = await SurveyModel.find(
//     { 'groups.isDeleted': false, _id: inspectionTypeId },
//     { 'groups._id': 1, 'groups.name': 1 }
//   );
//   if (group_data.length > 0) {
//     const group_data_res = group_data[0].groups;
//     groups = getDdlItems(DDL_FIELD_NAMES.default, group_data_res);
//     return groups;
//   } else {
//     return [];
//   }
// };

// const getInspectionParts = async (inspectionTypeId, inspectionGroupId) => {
//   const part_data = await SurveyModel.aggregate([
//     {
//       $match: {
//         _id: mongoose.Types.ObjectId(inspectionTypeId),
//         isDeleted: false,
//       },
//     },
//     { $unwind: '$groups' },
//     { $unwind: '$groups.parts' },
//     {
//       $match: {
//         'groups._id': mongoose.Types.ObjectId(inspectionGroupId),
//         isDeleted: false,
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         _id: '$groups.parts._id',
//         parts: '$groups.parts.name',
//       },
//     },
//   ]);

//   if (part_data.length > 0) {
//     part = getDdlItems(DDL_FIELD_NAMES.parts, part_data);
//     return part;
//   } else {
//     return [];
//   }
// };

// const getAllInspectionOfficers = async (filter) => {

//  const dealerId = filter.dealerId ? "YES" : "No";
//  const roleId = await RoleaccessModel.find({ isDeleted: false, slug:"inspection-officer" }, { _id: 1 });

//   // console.log(filter);
//   // console.log(dealerId);
//   // console.log(roleId[0]._id);
//   const pipeline = [{
//       $match: {
//           'role': roleId[0]._id,     
//           'isDeleted':false 
//         }
//   }];

//   if (dealerId == "YES")
//           pipeline.push({
//           $match: {
//               'dealerId': filter.dealerId,   
//           }
//       });

//   pipeline.push({ $sort: { createdAt: 1 } }, 
//   {
//       $project: {
//           _id:true,
//           userName:true,
//       }
//   });
//   const inspectionOfficers = getDdlItems(DDL_FIELD_NAMES.userName,await UserModel.aggregate(pipeline).allowDiskUse(true));

//   return inspectionOfficers;
// };

module.exports = {
  getRolesMasterData,
  getResourcesMasterData,
  getCountriesMasterData,
  getAlarmTimesMasterData,
  getCitiesMasterData,
  getCentersMasterData,
  getSubCentersMasterData,
  getCentersMasterDataByCityId,
  getCentersMasterData_old,
  getDriversMasterData,
  getVehiclesCategoryMasterData,
  getIncidentTypeMasterData,
  getIncidentSeverityMasterData,
  getVehiclesByCenterIdMasterData,
  getStatusMasterData,
  getVehiclesDashboardMasterData,
  getHospitalsMasterData,
  getPoliceStationsMasterData
};

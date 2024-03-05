const httpStatus = require("http-status");
const { IncidentDetailModel, IncidentTypeModel, IncidentSeverityModel, DriverTripLogModel, VehicleDetailModel, CenterModel } = require("../../../models");
const vehicleDetailService = require('../../../services/operations/vehicles/vehicleDetail.service').updateVehicleDetailById
const updateVehicleOnIncidentCreation = require('../../../services/operations/vehicles/vehicleDetail.service').updateVehicleOnIncidentCreation
const ApiError = require("../../../utils/ApiError");
const Pagination = require('../../../utils/common');
const Sequelize = require('sequelize');
const { include } = require("underscore");
var _ = require('underscore');
const { model } = require("mongoose");
const Op = Sequelize.Op;

/**
 * Create a IncidentDetail
 * @param {Object} IncidentDetailBody
 * @returns {Promise<IncidentDetail>}
 */
const createIncidentDetail = async (req, IncidentDetailBody) => {
  // // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
  // Making the Data of the Incident Details here.
  let vehicleIdCount = IncidentDetailBody.vehicleId.length
  let incidentDetailData = {
    callerName: IncidentDetailBody.callerName,
    callerCNIC: IncidentDetailBody.callerCNIC,
    callerPhoneNo: IncidentDetailBody.callerPhoneNo,
    patientName: IncidentDetailBody.patientName,
    patientCNIC: IncidentDetailBody.patientCNIC,
    shortDescription: IncidentDetailBody.shortDescription,
    location: IncidentDetailBody.location,
    area: IncidentDetailBody.area,
    incidentTypeId: IncidentDetailBody.incidentTypeId,
    incidentSeverityId: IncidentDetailBody.incidentSeverityId,
    createdBy: req.user.id
  }
  // Check if the Vehicles are available or not
  let vehicleCheck = false;
  IncidentDetailBody.vehicleId.map(async(item) => {
    let vehicleAvailability = await VehicleDetailModel.findOne({
      where: item
    });
    if(vehicleAvailability.status == 'InProgress') {
      vehicleCheck = true;
    }
  });
  if(vehicleCheck) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vehicle isn't available at the moment!");
  }

  //Creating the Incident Detail is here.
  let incidentDetailAdded = await IncidentDetailModel.create(incidentDetailData);
  let incidentDetailId = incidentDetailAdded.id

  // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();

  // Making the data of the Driver Trip log Using Incident details
  let data = [];
  for (let i = 0; i < vehicleIdCount; i++) {

    // console.log("IncidentDetailBody.vehicleId[i]", IncidentDetailBody.vehicleId[i]);
    const driver = await getDriverById(IncidentDetailBody.vehicleId[i])
    // console.log("driverId", driver.driverId)
    const triplogbyVehicleId = await getDriverTripLogByVehicleId(IncidentDetailBody.vehicleId[i])
    if (!triplogbyVehicleId) {

        /// get vehicle initial reading from vehicle master data

      let obj = {
        startDateTime: Date.now(),
        vehicleId: IncidentDetailBody.vehicleId[i],
        // initialReading: '0',
        initialReading: driver.milleage,
        finalReading: 0,
        kiloMeters: 0,
        status: "InProgress",
        createdBy: req.user.id,
        // centerId: IncidentDetailBody.centerId,
        alarmTimeId: IncidentDetailBody.alarmTimeId ? IncidentDetailBody.alarmTimeId : 2,
        sourceCenterId: driver.tempCenterId,
        sourceSubCenterId: driver.tempSubCenterId,
        driverId: driver.driverId,
        incidentId: incidentDetailId,
        dateTime: Date.now()
      };
      data.push(obj)

      const updateBody = {
        status: "InProgress"
      }
      // await vehicleDetailService(IncidentDetailBody.vehicleId[i], updateBody, req.user.id)
      await updateVehicleOnIncidentCreation(IncidentDetailBody.vehicleId[i], updateBody, req.user.id, driver.driverId)
    } else {
      let obj = {
        startDateTime: Date.now(),
        vehicleId: IncidentDetailBody.vehicleId[i],
        initialReading: triplogbyVehicleId.finalReading,
        finalReading: 0,
        kiloMeters: 0,
        status: "InProgress",
        createdBy: req.user.id,
        // centerId: IncidentDetailBody.centerId,
        alarmTimeId: IncidentDetailBody.alarmTimeId ? IncidentDetailBody.alarmTimeId : 2,
        sourceCenterId: driver.tempCenterId,
        sourceSubCenterId: driver.tempSubCenterId,
        driverId: driver.driverId,
        incidentId: incidentDetailId,
        dateTime: Date.now()
      };
      data.push(obj)

      const updateBody = {
        status: "InProgress"
      }
      // await vehicleDetailService(IncidentDetailBody.vehicleId[i], updateBody, req.user.id)
      await updateVehicleOnIncidentCreation(IncidentDetailBody.vehicleId[i], updateBody, req.user.id, driver.driverId)
    }
  }

  // console.log('Data', data);
  // Creating the Driver Trip log Here
  await DriverTripLogModel.bulkCreate(data)
  // Returning the Incient Details here
  return incidentDetailAdded
};

const getDriverById = async (id) => {
  const driverDetails = await VehicleDetailModel.findOne({
    where: { id: id },
    attributes: ['driverId', 'milleage', 'tempCenterId', 'tempSubCenterId']
  });
  return driverDetails;
};

const getDriverTripLogByVehicleId = async (vehicleId) => {
  console.log("triplog function", vehicleId);
  const DriverTripLog = await DriverTripLogModel.findOne({
    where: { vehicleId: vehicleId },
    order: [['updatedAt', 'DESC']]
  })

  if (!DriverTripLog) {
    // throw new ApiError(httpStatus.NOT_FOUND, "Driver TripLog not found");
    return null
  } else {
    return DriverTripLog
  }
}

/**
 * Query for IncidentDetails
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIncidentDetails = async (filter, options, searchQuery) => {
  // let limit = options.limit;
  // let offset = 0 + (options.page - 1) * limit;
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit
  searchQuery = searchQuery.toLowerCase();
  const { count, rows } = await IncidentDetailModel.findAndCountAll({
    where: {
      [Op.or]: [
        { callerName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('callerName')), 'LIKE', '%' + searchQuery + '%') },
        { callerCNIC: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('callerCNIC')), 'LIKE', '%' + searchQuery + '%') },
        { callerPhoneNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('callerPhoneNo')), 'LIKE', '%' + searchQuery + '%') },
        { patientName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('patientName')), 'LIKE', '%' + searchQuery + '%') },
        { 'T_INCIDENT_DETAILS.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_INCIDENT_DETAILS.location')), 'LIKE', '%' + searchQuery + '%') },
        // {area: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area')), 'LIKE', '%' + searchQuery + '%')},
        { 'incidentType.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('incidentType.name')), 'LIKE', '%' + searchQuery + '%') },
        { 'incidentSeverity.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('incidentSeverity.name')), 'LIKE', '%' + searchQuery + '%') },
      ]
    },
    order: [
      // ['id', 'DESC'],
      ['updatedAt', 'DESC']
    ],
    include: [
      {
        model: IncidentTypeModel,
        as: 'incidentType',
        attributes: ['name'],
      },
      {
        model: IncidentSeverityModel,
        as: 'incidentSeverity',
        attributes: ['name'],
      }
    ],
    offset: offset,
    limit: limit,
  });
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Get IncidentDetail by id
 * @param {ObjectId} id
 * @returns {Promise<IncidentDetailModel>}
 */
const getIncidentDetailById = async (id) => {

  const incidentData = await DriverTripLogModel.findAll({
    where: {
      incidentId: id
    },
    // attributes: ['centerId'],
    include: [
      {
        model: IncidentDetailModel,
        as: 'incident',
        attributes: ['id', 'callerName', 'callerCNIC', 'callerPhoneNo', 'patientName', 'patientCNIC', 'shortDescription', 'location', 'area'],
        include: [
          {
            model: IncidentSeverityModel,
            as: 'incidentSeverity',
            attributes: ['id', 'name']
          },
          {
            model: IncidentTypeModel,
            as: 'incidentType',
            attributes: ['id', 'name']
          }
        ]
      },
      {
        model: VehicleDetailModel,
        as: 'vehicle',
        attributes: ['id', 'regNo']
      },
      {
        model: CenterModel,
        as: 'sourcecenter',
        attributes: ['id', 'name']
      }
    ]
  });

  const insidentDataArr = JSON.parse(JSON.stringify(incidentData));
  const vehicleIdsObj = insidentDataArr.reduce((acc, cv) => {
    return { ...acc, ...cv, vehicleId: [...acc.vehicleId, { ...cv.vehicle }] }
  }, { vehicleId: [] });

  let oldVehicleIds = [];
  // console.log('vehicleIdsObj', vehicleIdsObj)
  vehicleIdsObj?.vehicleId?.map((val) => {
    console.log(val)
    oldVehicleIds.push(val?.id);
  });

  // console.log(oldVehicleIds)
  delete vehicleIdsObj.vehicle
  // delete vehicleIdsObj.center
  vehicleIdsObj.oldVehicleId = oldVehicleIds;
  // vehicleIdsObj.incident.incidentSeverityId = vehicleIdsObj.incident.incidentSeverity.id;
  // vehicleIdsObj.incident.incidentTypeId = vehicleIdsObj.incident.incidentType.id;

  return vehicleIdsObj
};

const getIncidentDetailByIdForUpdate = async (id) => {

  const incidentData = await IncidentDetailModel.findOne({
    where: {
      id: id
    },
  });
  return incidentData;
};

/**
 * Update IncidentDetail by id
 * @param {ObjectId} IncidentDetailId
 * @param {Object} updateBody
 * @returns {Promise<IncidentDetailModel>}
 */
const updateIncidentDetailById = async (IncidentDetailId, updateBody, updatedBy) => {

  // console.log("IncidentDetailId", IncidentDetailId);
  const IncidentDetail = await getIncidentDetailByIdForUpdate(IncidentDetailId);
  if (!IncidentDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Detail not found");
  }
  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  var oldVehicleIds = updateBody.oldVehicleId;
  var newVehicleIds = updateBody.newVehicleId;
  var centerId = updateBody.centerId;
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  delete updateBody.oldVehicleId;
  delete updateBody.newVehicleId;
  delete updateBody.centerId;
  Object.assign(IncidentDetail, updateBody);
  // console.log("IncidentDetail", IncidentDetail);
  const updatedIncidentDetail = await IncidentDetail.save();

  // console.log("oldVehicleIds", oldVehicleIds);
  // console.log("newVehicleIds", newVehicleIds);
  if (newVehicleIds.length) {

    // filter out new vehicleIds and create new array of vehicleIds
    for (let i = 0; i < newVehicleIds.length; i++) {
      oldVehicleIds.push(newVehicleIds[i]);
    }
    const vehicleIds = oldVehicleIds.filter(function (item) {
      return oldVehicleIds.lastIndexOf(item) == oldVehicleIds.indexOf(item);
    });

    // creating new triplog with new vehicleIds.
    if (vehicleIds.length) {
      // console.log("Final Array", vehicleIds)
      let data = [];
      for (let i = 0; i < vehicleIds.length; i++) {
        const driver = await getDriverById(vehicleIds[i])
    // console.log("driverId", driver.driverId)
        const triplogbyVehicleId = await getDriverTripLogByVehicleId(vehicleIds[i])
        if (!triplogbyVehicleId) {

          /// get vehicle initial reading from vehicle master data
          let obj = {
            startDateTime: Date.now(),
            vehicleId: vehicleIds[i],
            // initialReading: '0',
            initialReading: driver.milleage,
            finalReading: 0,
            kiloMeters: 0,
            status: "InProgress",
            updatedBy: updatedBy,
            // centerId: centerId,
            // alarmTimeId: updateBody.alarmTimeId,
            alarmTimeId: updateBody.alarmTimeId ? updateBody.alarmTimeId : 2,
            sourceCenterId: driver.tempCenterId,
            sourceSubCenterId: driver.tempSubCenterId,
            driverId: driver.driverId,
            incidentId: IncidentDetailId,
            dateTime: Date.now()
          };
          data.push(obj)

          const updateBody = {
            status: "InProgress"
          }
          // await vehicleDetailService(vehicleIds[i], updateBody, updatedBy)
          await updateVehicleOnIncidentCreation(vehicleIds[i], updateBody, updatedBy, driver.driverId)
        } else {
          let obj = {
            startDateTime: Date.now(),
            vehicleId: vehicleIds[i],
            initialReading: triplogbyVehicleId.finalReading,
            finalReading: 0,
            kiloMeters: 0,
            status: "InProgress",
            updatedBy: updatedBy,
            // centerId: centerId,
            // alarmTimeId: updateBody.alarmTimeId,
            alarmTimeId: updateBody.alarmTimeId ? updateBody.alarmTimeId : 2,
            sourceCenterId: driver.tempCenterId,
            sourceSubCenterId: driver.tempSubCenterId,
            driverId: driver.driverId,
            incidentId: IncidentDetailId,
            dateTime: Date.now()
          };
          data.push(obj)

          const updateBody = {
            status: "InProgress"
          }
          // await vehicleDetailService(vehicleIds[i], updateBody, updatedBy)
          await updateVehicleOnIncidentCreation(vehicleIds[i], updateBody, updatedBy, driver.driverId)
        }
      }

      // console.log('Data', data);
      // Creating the Driver Trip log Here
      await DriverTripLogModel.bulkCreate(data)

      // Returning the Updated Incient Details here
      return updatedIncidentDetail
      // return IncidentDetail

    }
  }
  // console.log("finally block")
  // Returning the Updated Incient Details here
  return updatedIncidentDetail
  // return IncidentDetail;

};

// const getDetailsofVehiclesbyCenterId = async (centerId, vehicleId) => {
//   const data = await DriverTripLogModel.findAll({
//     where: {centerId: centerId, vehicleId: vehicleId}
//   })
//   if(!data){
//     return null
//   }else{
//     return data
//   }
// }

/**
 * Delete IncidentDetail by id
 * @param {ObjectId} IncidentDetailId
 * @returns {Promise<IncidentDetailModel>}
 */
const deleteIncidentDetailById = async (IncidentDetailId) => {
  const IncidentDetail = await getIncidentDetailById(IncidentDetailId);
  if (!IncidentDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident Detail not found");
  }
  await IncidentDetail.destroy();
  return IncidentDetail;
};

module.exports = {
  createIncidentDetail,
  queryIncidentDetails,
  getIncidentDetailById,
  getIncidentDetailByIdForUpdate,
  updateIncidentDetailById,
  deleteIncidentDetailById,
  getDriverById
};

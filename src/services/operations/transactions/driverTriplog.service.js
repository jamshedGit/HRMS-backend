// const express = require("express");
const httpStatus = require("http-status");
const {
  DriverTripLogModel,
  CenterModel,
  CityModel,
  VehicleDetailModel,
  UserModel,
  IncidentDetailModel,
} = require("../../../models");
const vehicleDetailService =
  require("../../../services/operations/vehicles/vehicleDetail.service").updateVehicleDetailById;
const vehicleDetailServiceForTripLog =
  require("../../../services/operations/vehicles/vehicleDetail.service").updateVehicleDetailByIdOnTripLogUpdate;
const ApiError = require("../../../utils/ApiError");
const Pagination = require("../../../utils/common");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { from, to } = require("sequelize").DATE
const { HttpStatusCodes } = require('../../../utils/constants')
const { subCenterService, userService } = require('../../')

/**
 * Create a DriverTripLog
 * @param {Object} DriverTripLogBody
 * @returns {Promise<DriverTripLog>}
 */
const createDriverTripLog = async (req, DriverTripLogBody) => {
  // // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
};

const getDriverTripLogsByIncidentId = async (filter, options, searchQuery, incidentId) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // {startDateTime: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('startDateTime')))},
    // { initialReading: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('initialReading')), 'LIKE', '%' + searchQuery + '%') },
    // { finalReading: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('finalReading')), 'LIKE', '%' + searchQuery + '%') },
    { 'T_DRIVER_TRIPLOG.status': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_DRIVER_TRIPLOG.status')), 'LIKE', '%' + searchQuery + '%') },
    // {'T_INCIDENT_DETAILS.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_INCIDENT_DETAILS.location')), 'LIKE', '%' + searchQuery + '%')},
    // // {area: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area')), 'LIKE', '%' + searchQuery + '%')},
    { 'sourcecenter.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('sourcecenter.name')), 'LIKE', '%' + searchQuery + '%') },
    { 'vehicle.regNo': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('vehicle.regNo')), 'LIKE', '%' + searchQuery + '%') },
    { 'driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('driver.firstName')), 'LIKE', '%' + searchQuery + '%') },
    // {'vehicle.driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('vehicle.driver.firstName')), 'LIKE', '%' + searchQuery + '%')},
  ]
  // const date = Date.parse(searchQuery)
  // console.log('search query type', date);

  // if (date) {
  //   queryFilters.push({
  //     startDateTime: {
  //       [Op.between]: [date, date] // ["2022-09-01T11:32:10.999Z"]
  //     }
  //   },
  //     {
  //       endDateTime: {
  //         [Op.between]: [date, date] // ["2022-09-01T11:32:10.999Z"]
  //       }
  //     },)
  // }
  const { count, rows } = await DriverTripLogModel.findAndCountAll({
    where: {
      incidentId: incidentId,
      [Op.or]: queryFilters
    },
    order: [["updatedAt", "DESC"]],
    include: [
      {
        model: CenterModel,
        as: "sourcecenter",
        attributes: ["name"],
      },
      {
        model: VehicleDetailModel,
        as: "vehicle",
        attributes: ["regNo"],
        // include: {
        //   model: UserModel,
        //   as: "driver",
        //   attributes: ["firstName"],
        // },
      },
      {
        model: UserModel,
        as: "driver",
        attributes: ["firstName", "lastName", 'phNo'],
      },
    ],
    offset: offset,
    limit: limit,
  });

  return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
};

const getDriverTriplogByVehicleId = async (filter, options, searchQuery, vehicleId) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  searchQuery = searchQuery.toLowerCase();
      // {startDateTime: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('startDateTime')))},
    // { initialReading: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('initialReading')), 'LIKE', '%' + searchQuery + '%') },
    // { finalReading: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('finalReading')), 'LIKE', '%' + searchQuery + '%') },
    // {'T_INCIDENT_DETAILS.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_INCIDENT_DETAILS.location')), 'LIKE', '%' + searchQuery + '%')},
    // // {area: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area')), 'LIKE', '%' + searchQuery + '%')},
    // {'vehicle.driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('vehicle.driver.firstName')), 'LIKE', '%' + searchQuery + '%')},
    // { 'T_DRIVER_TRIPLOG.status': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_DRIVER_TRIPLOG.status')), 'LIKE', '%' + searchQuery + '%') },
    // { 'sourcecenter.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('sourcecenter.name')), 'LIKE', '%' + searchQuery + '%') },
    // { 'vehicle.regNo': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('vehicle.regNo')), 'LIKE', '%' + searchQuery + '%') },
    // { 'driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('driver.firstName')), 'LIKE', '%' + searchQuery + '%') },
  // ]}
  const queryFilters = []
    if (filter.fromLogNo && filter.toLogNo) {
      console.log("fromLogNo", filter?.fromLogNo)
      console.log("toLogNo", filter?.toLogNo)
      queryFilters.push({
        logBookNo: {
          [Op.between]: [filter.fromLogNo, filter.toLogNo]
        }
      })
    }

  const { count, rows } = await DriverTripLogModel.findAndCountAll({
    where: {
      [Op.and]: queryFilters,
      vehicleId: vehicleId,
    },
    order: [["createdAt", "DESC"]],
    // order: [["updatedAt", "DESC"]],
    include: [
      {
        model: CenterModel,
        as: "sourcecenter",
        attributes: ["name"],
      },
      {
        model: VehicleDetailModel,
        as: "vehicle",
        attributes: ["regNo"],
        // include: {
        //   model: UserModel,
        //   as: "driver",
        //   attributes: ["firstName"],
        // },
      },
      {
        model: UserModel,
        as: "driver",
        attributes: ["firstName", "lastName", 'phNo'],
      },
    ],
    offset: offset,
    limit: limit,
  });

  return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Query for DriverTripLog
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDriverTripLogs = async (filter, options, searchQuery) => {
  // let limit = options.limit;
  // let offset = 0 + (options.page - 1) * limit;
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // {startDateTime: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('startDateTime')))},
    // { initialReading: Sequelize.where(Sequelize.fn('INTEGER', Sequelize.col('initialReading')), 'LIKE', '%' + searchQuery + '%') },
    // { logBookNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('logBookNo')), 'LIKE', '%' + searchQuery + '%') },
    // { finalReading: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('finalReading')), 'LIKE', '%' + searchQuery + '%') },
    { 'T_DRIVER_TRIPLOG.status': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_DRIVER_TRIPLOG.status')), 'LIKE', '%' + searchQuery + '%') },
    // {'T_INCIDENT_DETAILS.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_INCIDENT_DETAILS.location')), 'LIKE', '%' + searchQuery + '%')},
    // // {area: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area')), 'LIKE', '%' + searchQuery + '%')},
    { 'sourcecenter.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('sourcecenter.name')), 'LIKE', '%' + searchQuery + '%') },
    { 'vehicle.regNo': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('vehicle.regNo')), 'LIKE', '%' + searchQuery + '%') },
    { 'driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('driver.firstName')), 'LIKE', '%' + searchQuery + '%') },
    // {'vehicle.driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('vehicle.driver.firstName')), 'LIKE', '%' + searchQuery + '%')},
  ]
  // const date = Date.parse(searchQuery)
  // console.log('search query type', date);

  // if (date) {
  //   queryFilters.push({
  //     startDateTime: {
  //       [Op.between]: [date, date] // ["2022-09-01T11:32:10.999Z"]
  //     }
  //   },
  //     {
  //       endDateTime: {
  //         [Op.between]: [date, date] // ["2022-09-01T11:32:10.999Z"]
  //       }
  //     },)
  // }
  const { count, rows } = await DriverTripLogModel.findAndCountAll({
    where: {
      [Op.or]: queryFilters
      // [Op.or]: [
      //   {
      //     startDateTime: {
      //       [Op.between]: [searchQuery, searchQuery] // ["2022-09-01T11:32:10.999Z"]
      //     }
      //   },
      //   {
      //     endDateTime: {
      //       [Op.between]: [searchQuery, searchQuery] // ["2022-09-01T11:32:10.999Z"]

      //     }
      //   },
      //   // {startDateTime: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('startDateTime')))},
      //   {
      //     initialReading: Sequelize.where(
      //       Sequelize.fn("LOWER", Sequelize.col("initialReading")),
      //       "LIKE",
      //       "%" + searchQuery + "%"
      //     ),
      //   },
      //   {
      //     finalReading: Sequelize.where(
      //       Sequelize.fn("LOWER", Sequelize.col("finalReading")),
      //       "LIKE",
      //       "%" + searchQuery + "%"
      //     ),
      //   },
      //   {
      //     "T_DRIVER_TRIPLOG.status": Sequelize.where(
      //       Sequelize.fn("LOWER", Sequelize.col("T_DRIVER_TRIPLOG.status")),
      //       "LIKE",
      //       "%" + searchQuery + "%"
      //     ),
      //   },
      //   // {'T_INCIDENT_DETAILS.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_INCIDENT_DETAILS.location')), 'LIKE', '%' + searchQuery + '%')},
      //   // // {area: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area')), 'LIKE', '%' + searchQuery + '%')},
      //   {
      //     "center.name": Sequelize.where(
      //       Sequelize.fn("LOWER", Sequelize.col("center.name")),
      //       "LIKE",
      //       "%" + searchQuery + "%"
      //     ),
      //   },
      //   {
      //     "vehicle.regNo": Sequelize.where(
      //       Sequelize.fn("LOWER", Sequelize.col("vehicle.regNo")),
      //       "LIKE",
      //       "%" + searchQuery + "%"
      //     ),
      //   },
      //   {
      //     "vehicle.driver.firstName": Sequelize.where(
      //       Sequelize.fn("LOWER", Sequelize.col("vehicle.driver.firstName")),
      //       "LIKE",
      //       "%" + searchQuery + "%"
      //     ),
      //   },
      // ],
    },
    order: [["updatedAt", "DESC"]],
    include: [
      {
        model: CenterModel,
        as: "sourcecenter",
        attributes: ["id","name"],
        include: [{
          model: CityModel,
          as: "city",
          attributes: ["id", "name"],
        },]
      },
      {
        model: CenterModel,
        as: "destinationcenter",
        attributes: ["name"],
      },
      {
        model: VehicleDetailModel,
        as: "vehicle",
        attributes: ["regNo"],
        // include: {
        //   model: UserModel,
        //   as: "driver",
        //   attributes: ["firstName"],
        // },
      },
      {
        model: UserModel,
        as: "driver",
        attributes: ["firstName", "lastName", 'phNo'],
      },
    ],
    offset: offset,
    limit: limit,
  });
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Get DriverTripLog by id
 * @param {ObjectId} id
 * @returns {Promise<DriverTripLogModel>}
 */
const getDriverTripLogById = async (id) => {
  return DriverTripLogModel.findByPk(id, {
    order: [["updatedAt", "DESC"]],
    include: [
      {
        model: CenterModel,
        as: "sourcecenter",
        attributes: ["id","name"],
        include: [{
          model: CityModel,
          as: "city",
          attributes: ["id","name"],
        },]
      },
      {
        model: VehicleDetailModel,
        as: "vehicle",
        attributes: ["regNo"],
        // include: {
        //   model: UserModel,
        //   as: "driver",
        //   attributes: ["firstName"],
        // },
      },
      {
        model: UserModel,
        as: "driver",
        attributes: ["firstName", "lastName", 'phNo'],
      },
    ],
  });
};

/**
 * Update DriverTripLog by id
 * @param {ObjectId} DriverTripLogId
 * @param {Object} updateBody
 * @returns {Promise<DriverTripLogModel>}
 */
const updateDriverTripLogById = async (
  DriverTripLogId,
  updateBody,
  updatedBy
) => {
  const DriverTripLog = await getDriverTripLogById(DriverTripLogId);
  if (!DriverTripLog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver TripLog not found");
  }
  // console.log(updateBody.logBookNo, typeof(updateBody.logBookNo.toString()));
  const getLogBookMatched = await DriverTripLogModel.findOne({
    // where: { logBookNo: updateBody.logBookNo.toString() }
    where: {
      logBookNo: updateBody?.logBookNo, 
      id: {
        [Op.ne]: DriverTripLogId,
      }  }
  })
  if (getLogBookMatched){
    throw new ApiError(HttpStatusCodes.VALIDATION, "Log Book Number should be Unique");
  }
  console.log("initialreading", DriverTripLog?.initialReading)
  console.log("finalreading", updateBody?.finalReading)
  if (updateBody?.finalReading <= DriverTripLog?.initialReading) {
    throw new ApiError(HttpStatusCodes.VALIDATION, "FINAL READING should be greater than INITIAL READING");
  }
  if (updateBody.price < 0) {
    throw new ApiError(HttpStatusCodes.VALIDATION, "PRICE should be greater than 0");
  }

  // Getting center based on sub center
  let centerRecord = await subCenterService.getSubCenterByCenterId(updateBody.subCenterId);
  // console.log("centerRecord", centerRecord.center);

  if(!centerRecord?.center) {
    throw new ApiError(httpStatus.NOT_FOUND, "Main Center not found");
  } 
  // updateBody.destinationCenterId =  centerRecord.center.id,
  // updateBody.destinationSubCenterId = updateBody.subCenterId

  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  const updateBodyVehicle = {
    status: "Available",
    tempCenterId: centerRecord.center.id,
    tempSubCenterId: updateBody.subCenterId,
  };
  // Changing Vehicle Status
  //yahan py program phat rha hai
  //yahan py logic change hogi vehicle k status ko available karna hai 
  await vehicleDetailServiceForTripLog(
    DriverTripLog.vehicleId,
    updateBodyVehicle,
    updatedBy
  );

  // Updating driver's trip status
  if (DriverTripLog.driverId){
    const newBodyForDriver = {
      tripStatus: "Available",
    };
    await userService.updateUserById(DriverTripLog.driverId, newBodyForDriver, updatedBy)
  }

  // Calculating KiloMeters how many vehicle travel in a trip
  const kiloMeters =
    // parseInt(updateBody.finalReading) - parseInt(DriverTripLog.initialReading);
    updateBody?.finalReading - DriverTripLog?.initialReading;

  // const statusUpdate =
  //   updateBody.status === "Compeleted"
  //     ? await vehicleDetailServiceForTripLog(
  //       DriverTripLog.vehicleId,
  //       updateBodyVehicle,
  //       updatedBy
  //     )
  //     : null;
  // console.log('statusUpdate', statusUpdate);

  //Creating data of the updateBody of Triplog
  updateBody.updatedBy = updatedBy;
  updateBody.endDateTime = Date.now();
  // updateBody.kiloMeters = kiloMeters.toString();
  updateBody.kiloMeters = kiloMeters ? kiloMeters : DriverTripLog.kiloMeters;
  updateBody.destinationCenterId = centerRecord.center.id;
  updateBody.destinationSubCenterId = updateBody.subCenterId;

  delete updateBody.id;
  console.log("check", DriverTripLog)
  console.log("update body to be", updateBody)
  // console.log("Triplog body",updateBody);
  Object.assign(DriverTripLog, updateBody);
  await DriverTripLog.save();

  // Checking for all trip logs status under this very incident of the current trip log
  // Get incidentId
  const getIncidentId = await DriverTripLogModel.findOne({
    where: { id: DriverTripLogId }
  })

  // Get all trip logs with that particular incident
  const allTripLogsFromIncident = await DriverTripLogModel.findAll({
    where: {
      incidentId: getIncidentId.incidentId,
      status: {
        [Op.ne]: 'Close',
      }
    }
  })
  // If no other status found in trip logs other than 'Close' update Incident
  if (!allTripLogsFromIncident.length) {
    const updateIncident = IncidentDetailModel.update(
      {
        status: 'Close'
      },
      {
        where: {
          id: getIncidentId.incidentId
        }
      })
  }

  return getDriverTripLogById(DriverTripLog.id);
};

/**
 * Delete DriverTripLog by id
 * @param {ObjectId} DriverTripLogId
 * @returns {Promise<DriverTripLogModel>}
 */
const deleteDriverTripLogById = async (DriverTripLogId) => {
  const DriverTripLog = await getDriverTripLogById(DriverTripLogId);
  if (!DriverTripLog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver TripLog not found");
  }
  await DriverTripLog.destroy();
  return DriverTripLog;
};

module.exports = {
  createDriverTripLog,
  queryDriverTripLogs,
  getDriverTripLogById,
  updateDriverTripLogById,
  deleteDriverTripLogById,
  getDriverTripLogsByIncidentId,
  getDriverTriplogByVehicleId
};

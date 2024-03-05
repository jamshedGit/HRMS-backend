const httpStatus = require("http-status");
const { VehicleDetailModel, VehicleCategoryModel, CenterModel, UserModel, SubCenterModel } = require("../../../models");
const Pagination = require('../../../utils/common');
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { userService } = require("../../../services");


/**
 * Create a VehicleDetail
 * @param {Object} VehicleDetailBody
 * @returns {Promise<VehicleDetail>}
 */
const createVehicleDetail = async (req, VehicleDetailBody) => {
  // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
  VehicleDetailBody.createdBy = req.user.id;
  VehicleDetailBody.centerId = VehicleDetailBody.centerId;
  VehicleDetailBody.subCenterId = VehicleDetailBody.subCenterId;
  VehicleDetailBody.tempCenterId = VehicleDetailBody.centerId;
  VehicleDetailBody.tempSubCenterId = VehicleDetailBody.subCenterId;

  if (await VehicleDetailModel.isRegNoForNewVehicle(VehicleDetailBody.regNo)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This registeration number is already taken');
  }

  const VehicleDetailAdded = await VehicleDetailModel.create(VehicleDetailBody);

  if (VehicleDetailBody.driverId){
    const driver = await userService.getUserById(VehicleDetailBody.driverId);
    if (!driver) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
    }
    const updateBody = {
      status: "Not Available"
    }
    Object.assign(driver, updateBody);
    const driverStatusUpdate = await driver.save();
  }
  return getVehicleDetailById(VehicleDetailAdded.id)

  // return VehicleDetailAdded;
};

const queryVehicleDetails = async (filter, options, searchQuery) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit
  searchQuery = searchQuery.toLowerCase();
  const { count, rows } = await VehicleDetailModel.findAndCountAll({
    order: [
      ['updatedAt', 'DESC']
    ],
    where: {
      [Op.or]: [
        {'T_VEHICLE_DETAILS.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_VEHICLE_DETAILS.name')), 'LIKE', '%' + searchQuery + '%') },
        {'T_VEHICLE_DETAILS.status': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_VEHICLE_DETAILS.status')), 'LIKE', '%' + searchQuery + '%')},
        {regNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('regNo')), 'LIKE', '%' + searchQuery + '%')},
        {'category.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('category.name')), 'LIKE', '%' + searchQuery + '%') },
        {'driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('driver.firstName')), 'LIKE', '%' + searchQuery + '%')},
        {'center.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.name')), 'LIKE', '%' + searchQuery + '%')}
      ]
    },
    include: [
      {
        model: VehicleCategoryModel,
        as : 'category',
        attributes: ['name'],
      },
      {
        model: CenterModel,
        as : 'center',
        attributes: ['name'],
      },
      {
        model: UserModel,
        as: 'driver',
        attributes: ['firstName', 'phNo', 'status']
      }
    ],
    offset: offset,
    limit: limit,
  });
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows );
  // return VehicleCategories;
};

// Getting all vehicles with centerId 
const getVehicleDetailbyCenterId = async (filter, options, searchQuery) => {
  let centerId = filter.centerId
  let subCenterId = filter.subCenterId
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit
  searchQuery = searchQuery.toLowerCase();
  conditionalCenterQuery = subCenterId ? { tempSubCenterId : subCenterId } : { tempCenterId: centerId } 
  const { count, rows }  = await VehicleDetailModel.findAndCountAll({
    where: {
      ...conditionalCenterQuery, 
      // status: 'Available',
      [Op.or]: [
        {'T_VEHICLE_DETAILS.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_VEHICLE_DETAILS.name')), 'LIKE', '%' + searchQuery + '%')},
        {regNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('regNo')), 'LIKE', '%' + searchQuery + '%')},
        { registerCity: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('registerCity')), 'LIKE', '%' + searchQuery + '%') },
        { make: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('make')), 'LIKE', '%' + searchQuery + '%') },
        { fuelType: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fuelType')), 'LIKE', '%' + searchQuery + '%') },
        // {'T_VEHICLE_DETAILS.isActive': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_VEHICLE_DETAILS.isActive')), 'LIKE', '%' + searchQuery + '%') },
        {'T_VEHICLE_DETAILS.status': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_VEHICLE_DETAILS.status')), 'LIKE', '%' + searchQuery + '%')},
        {'category.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('category.name')), 'LIKE', '%' + searchQuery + '%')},
        {'driver.firstName': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('driver.firstName')), 'LIKE', '%' + searchQuery + '%')},
        {'driver.phNo': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('driver.phNo')), 'LIKE', '%' + searchQuery + '%')},
        {'driver.status': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('driver.status')), 'LIKE', '%' + searchQuery + '%')}
        // {'center.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.name')), 'LIKE', '%' + searchQuery + '%')}
      ],
        driverId: {
          [Op.not]: null
        }
    }, 
    order: [
      ['updatedAt', 'DESC']
    ],
    include: [
      {
        model: VehicleCategoryModel,
        as : 'category',
        attributes: ['name'],
      },
      {
        model: CenterModel,
        as : 'center',
        attributes: ['name'],
      },
      {
        model: UserModel,
        as: 'driver',
        attributes: ['firstName', 'phNo', 'status'],
      }
    ],
    offset: offset,
    limit: limit,
  });
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows );
  // return VehicleDetails;
};
/**
 * Get VehicleDetail by id
 * @param {ObjectId} id
 * @returns {Promise<VehicleDetailModel>}
 */
const getVehicleDetailById = async (id) => {
  const  vehicleData = await VehicleDetailModel.findByPk(id, {
    include: [
      {
        model: VehicleCategoryModel,
        as : 'category',
        attributes: ['name'],
      },
      {
        model: CenterModel,
        as : 'center',
        attributes: ['name'],
      },
      {
        model: UserModel,
        as: 'driver',
        attributes: ['firstName', 'phNo', 'status']
      }
    ],
  });
  return vehicleData
};

/**
 * Update VehicleDetail by id
 * @param {ObjectId} VehicleDetailId
 * @param {Object} updateBody
 * @returns {Promise<VehicleDetailModel>}
 */
const updateVehicleDetailById = async (VehicleDetailId, updateBody, updatedBy) => {
  const VehicleDetail = await getVehicleDetailById(VehicleDetailId);
  if (!VehicleDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Detail not found");
  }
  if (updateBody.regNo && (await VehicleDetailModel.isRegNoForOldVehicle(updateBody.regNo, VehicleDetailId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This registeration number is already taken');
  }
  if (VehicleDetail.status == 'Available' || VehicleDetail.status == 'offDuty') {
    updateBody.tempCenterId = updateBody.centerId;
    updateBody.tempSubCenterId = updateBody.subCenterId;
    updateBody.updatedBy = updatedBy;
    delete updateBody.id;
    Object.assign(VehicleDetail, updateBody);
    const VehicleUpdated = await VehicleDetail.save();

    if (updateBody.oldDriverId && updateBody.driverId){

      const newBodyForDriver = {
        status: "Not Available",
      };
      await userService.updateUserById(updateBody.driverId, newBodyForDriver, updatedBy)
      const oldBodyForDriver = {
        status: "Available",
      };
      await userService.updateUserById(updateBody.oldDriverId, oldBodyForDriver, updatedBy)
      // return ;
      return getVehicleDetailById(VehicleUpdated.id)
    }

    return getVehicleDetailById(VehicleUpdated.id)
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vehicle isn't available at the moment. Please try again later!");
  }

};

const updateVehicleOnIncidentCreation = async (VehicleDetailId, updateBody, updatedBy, driverId) => {
  const VehicleDetail = await getVehicleDetailById(VehicleDetailId);
  if (!VehicleDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Detail not found");
  }
  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  if(VehicleDetail.status == 'Available') {
    // updateBody.tempCenterId = updateBody.centerId;
    // updateBody.tempSubCenterId = updateBody.subCenterId;
    updateBody.updatedBy = updatedBy;
    delete updateBody.id;
    Object.assign(VehicleDetail, updateBody);
    const VehicleUpdated = await VehicleDetail.save();

    // if (updateBody.oldDriverId && updateBody.driverId){
    if (driverId){
      const newBodyForDriver = {
        tripStatus: "Not Available",
      };
      await userService.updateUserById(driverId, newBodyForDriver, updatedBy)
      // const oldBodyForDriver = {
      //   status: "Available",
      // };
      // await userService.updateUserById(updateBody.oldDriverId, oldBodyForDriver, updatedBy)
      // return ;
      return getVehicleDetailById(VehicleUpdated.id)
    }

    return getVehicleDetailById(VehicleUpdated.id)
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vehicle isn't available at the moment. Please try again later!");
  }

};

/**
 * Update VehicleDetail by id
 * @param {ObjectId} VehicleDetailId
 * @param {Object} updateBody
 * @returns {Promise<VehicleDetailModel>}
 */
const updateVehicleDetailByIdOnTripLogUpdate = async (VehicleDetailId, updateBody, updatedBy) => {
  const VehicleDetail = await getVehicleDetailById(VehicleDetailId);
  if (!VehicleDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Detail not found");
  }
  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  // if (VehicleDetail.status == 'InProgress') {
    updateBody.updatedBy = updatedBy;
    delete updateBody.id;
    Object.assign(VehicleDetail, updateBody);
    const VehicleUpdated = await VehicleDetail.save();
    return getVehicleDetailById(VehicleUpdated.id)
  // } else {
    // throw new ApiError(httpStatus.BAD_REQUEST, "Vehicle is already available at the moment. something went wrong!");
  // }

};

const updateVehicleStatusById = async (VehicleDetailId, updateBody, updatedBy) => {
  const VehicleDetail = await getVehicleDetailById(VehicleDetailId);
  if (!VehicleDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Detail not found");
  }
  if (updateBody.available === true){

    if (VehicleDetail.status === 'offDuty') {
      console.log("VehicleDetail.status", VehicleDetail.status)
      updateBody.updatedBy = updatedBy;
      updateBody.status = 'Available';
      delete updateBody.id;
      delete updateBody.available;
      delete updateBody.offDuty;
      Object.assign(VehicleDetail, updateBody);
      const VehicleUpdated = await VehicleDetail.save();
      // return getVehicleDetailById(VehicleUpdated.id)
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Vehicle is already available. Please try again later!");
    }
  } else if (updateBody.offDuty === true){

    if (VehicleDetail.status == 'Available') {

      console.log("VehicleDetail.status", VehicleDetail.status)
      updateBody.updatedBy = updatedBy;
      updateBody.status = 'offDuty';
      delete updateBody.id;
      delete updateBody.available;
      delete updateBody.offDuty;
      Object.assign(VehicleDetail, updateBody);
      const VehicleUpdated = await VehicleDetail.save();
      // return getVehicleDetailById(VehicleUpdated.id)
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Vehicle isn't available at the moment. Please try again later!");
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong kindly check your payload!");

  }

};

/**
 * Delete VehicleDetail by id
 * @param {ObjectId} VehicleDetailId
 * @returns {Promise<VehicleDetailModel>}
 */
const deleteVehicleDetailById = async (VehicleDetailId, deleteBody, updatedBy) => {
  const VehicleDetail = await getVehicleDetailById(VehicleDetailId);
  if (!VehicleDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Detail not found");
  }
  deleteBody.updatedBy = updatedBy;

  if (VehicleDetail.isActive) {
    console.log("Vehicle Status", VehicleDetail.isActive)
    // console.log("Vehicle Status", VehicleDetail.status.trim())

    if (VehicleDetail.status.trim() === 'InProgress') {
      // console.log("User Status", user.tripStatus.trim())
      throw new ApiError(httpStatus.NOT_FOUND, 'The vehicle is on a trip. Please try again when the vehicle is available.');
    }
  }

  // Get respective sub center with a check of isActive
  if(!VehicleDetail.isActive) {
    let subCenterDetail = await SubCenterModel.findAll({
      where: {
        id: VehicleDetail.tempSubCenterId,
        isActive: true
      }
    });
    if(subCenterDetail.length) {
      deleteBody.isActive = true
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Respective Sub Center is not active.");
    }
  } else {
    deleteBody.isActive = false
  }

  VehicleDetail.isActive ? deleteBody.status = 'offDuty' : deleteBody.status = 'Available'; 
  delete deleteBody.id;
  Object.assign(VehicleDetail, deleteBody);
  const updatedVehicleDetail = await VehicleDetail.save();
  return getVehicleDetailById(updatedVehicleDetail.id)
  // await VehicleDetail.destroy();
  // return VehicleDetail;
};

module.exports = {
  createVehicleDetail,
  queryVehicleDetails,
  getVehicleDetailById,
  updateVehicleDetailById,
  deleteVehicleDetailById,
  getVehicleDetailbyCenterId,
  updateVehicleOnIncidentCreation,
  updateVehicleDetailByIdOnTripLogUpdate,
  updateVehicleStatusById
};

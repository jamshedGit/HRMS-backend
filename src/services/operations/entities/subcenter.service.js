const httpStatus = require("http-status");
const { SubCenterModel, CountryModel, CityModel, CenterModel, VehicleDetailModel } = require("../../../models");
const Pagination = require('../../../utils/common');
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Create a SubCenter
 * @param {Object} SubCenterBody
 * @returns {Promise<SubCenter>}
 */
const createSubCenter = async (req, SubCenterBody) => {
  SubCenterBody.slug = SubCenterBody.name.replace(/ /g, "-").toLowerCase();
  SubCenterBody.createdBy = req.user.id;
  const subcenterAdded = await SubCenterModel.create(SubCenterBody);
  return getSubCenterById(subcenterAdded.id)
  // return subcenterAdded;
};

/**
 * Query for SubCenters
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubCenters = async (filter, options, searchQuery) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit
  searchQuery = searchQuery.toLowerCase();
  const { count, rows } = await SubCenterModel.findAndCountAll({
    order: [
      ['updatedAt', 'DESC']
    ],
    where: {
      [Op.or]: [
        { 'T_SUB_CENTERS.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_SUB_CENTERS.name')), 'LIKE', '%' + searchQuery + '%') },
        { 'center.country.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.country.name')), 'LIKE', '%' + searchQuery + '%') },
        { 'center.city.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.city.name')), 'LIKE', '%' + searchQuery + '%') },
        { 'center.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.name')), 'LIKE', '%' + searchQuery + '%')},
        { 'center.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.location')), 'LIKE', '%' + searchQuery + '%') },
        { 'T_SUB_CENTERS.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_SUB_CENTERS.location')), 'LIKE', '%' + searchQuery + '%')},
        // { 'center.phoneNo': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.phoneNo')), 'LIKE', '%' + searchQuery + '%') },
        { 'T_SUB_CENTERS.phoneNo': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_SUB_CENTERS.phoneNo')), 'LIKE', '%' + searchQuery + '%') },
        // {phoneNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('phoneNo')), 'LIKE', '%' + searchQuery + '%')}
      ],
      // isActive: true
    },
    include: [
      {
        model: CenterModel,
        as: "center",
        attributes: ["name"],
          include: [
              { model: CountryModel,
                as: "country",
                attributes: ["name"],
              },
              {
                model: CityModel,
                as: "city",
                attributes: ["name"],
              }
            ]
      }
      // {
      //   model: CenterModel,
      //   as: "center",
      //   attributes: ["name"],
      //   include: {
      //     model: CountryModel,
      //     as: "country",
      //     attributes: ["name"],
      //   },
      //   include: {
      //     model: CityModel,
      //     as: "city",
      //     attributes: ["name"],
      //   },
      // },
    ],
    offset: offset,
    limit: limit,
    order: [
      ['createdAt', 'DESC']
  ]
  });
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows );
  // return SubCenters;
};

/**
 * Get SubCenter by id
 * @param {ObjectId} id
 * @returns {Promise<SubCenterModel>}
 */
const getSubCenterById = async (id) => {
  // return SubCenterModel.findByPk(id);
  return SubCenterModel.findByPk(id, {
    include: [
      {
        model: CenterModel,
        as: 'center',
        attributes: ['name'],
      }],
  });
};

const getSubCenterByCenterId = async (id) => {
  return SubCenterModel.findByPk(id, {
    include: [
      {
        model: CenterModel,
        as: 'center',
        attributes: ['id'],
      }],
  });
};

/**
 * Update SubCenter by id
 * @param {ObjectId} SubCenterId
 * @param {Object} updateBody
 * @returns {Promise<SubCenterModel>}
 */
const updateSubCenterById = async (SubCenterId, updateBody, updatedBy) => {
  const SubCenter = await getSubCenterById(SubCenterId);
  if (!SubCenter) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubCenter not found");
  }
  updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(SubCenter, updateBody);
  const updatedSubCenter = await SubCenter.save();
  return getSubCenterById(updatedSubCenter.id)
};

/**
 * Delete SubCenter by id
 * @param {ObjectId} SubCenterId
 * @returns {Promise<SubCenterModel>}
 */
const deleteSubCenterById = async (SubCenterId, deleteBody, updatedBy) => {
  const SubCenter = await getSubCenterById(SubCenterId);
  if (!SubCenter) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubCenter not found");
  }


  deleteBody.updatedBy = updatedBy;
  if(!SubCenter.isActive) {
    // Get Centers
    let getCenter = await CenterModel.findAll({
      where: {
        id: SubCenter.centerId,
        isActive: true
      }
    })
    if(getCenter.length) {
      deleteBody.isActive = true;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Respective center is not active."); 
    }
  } else {
    // Get all sub center vehicles
    let getAllVehicles = await VehicleDetailModel.findAll({
      where: {
        tempSubCenterId: SubCenter.id,
        isActive: true
      }
    })
    if(getAllVehicles.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Pls make sure all associated vehicles are marked InActive before this operation."); 
    }
    else {
      deleteBody.isActive = false;
    }
  }

  delete deleteBody.id;
  Object.assign(SubCenter, deleteBody);
  const updatedSubCenter = await SubCenter.save();
  return getSubCenterById(updatedSubCenter.id)
  // await SubCenter.destroy();
  // return SubCenter;
};

module.exports = {
  createSubCenter,
  querySubCenters,
  getSubCenterById,
  updateSubCenterById,
  deleteSubCenterById,
  getSubCenterByCenterId
};

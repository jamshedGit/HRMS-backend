const httpStatus = require("http-status");
const { CenterModel, CountryModel, CityModel, SubCenterModel } = require("../../../models");
const Pagination = require('../../../utils/common');
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Create a Center
 * @param {Object} CenterBody
 * @returns {Promise<Center>}
 */
const createCenter = async (req, CenterBody) => {
  CenterBody.slug = CenterBody.name.replace(/ /g, "-").toLowerCase();
  CenterBody.createdBy = req.user.id;
  const centerAdded = await CenterModel.create(CenterBody);
  
  // return centerAdded;
  const createdCenter = await getCenterByIdWithCityAndCountry(centerAdded.id)
  return createdCenter;
};

/**
 * Query for Centers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCenters = async (filter, options, searchQuery) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit
  searchQuery = searchQuery.toLowerCase();
  const { count, rows } = await CenterModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: [
        { 'T_CENTERS.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_CENTERS.name')), 'LIKE', '%' + searchQuery + '%') },
        { 'country.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('country.name')), 'LIKE', '%' + searchQuery + '%') },
        {'city.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('city.name')), 'LIKE', '%' + searchQuery + '%')},
        {location: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('location')), 'LIKE', '%' + searchQuery + '%')},
        {phoneNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('phoneNo')), 'LIKE', '%' + searchQuery + '%')}
      ],
      // isActive: true
    },
    include: [
      {
        model: CountryModel,
        as: 'country',
        attributes: ['name']
      },
      {
        model: CityModel,
        as: 'city',
        attributes: ['name'],
      },
      // {
      //   model: UserModel,
      //   as: 'driver',
      //   attributes: ['firstName', 'phNo', 'status']
      // }
    ],
    offset: offset,
    limit: limit,
    order: [
      ['createdAt', 'DESC']
  ],
  });
  return Pagination.paginationFacts(count, limit, options.pageNumber, rows );
  // return Centers;
};

/**
 * Get Center by id
 * @param {ObjectId} id
 * @returns {Promise<CenterModel>}
 */
const getCenterById = async (id) => {
  return CenterModel.findByPk(id);
};
const getCenterByIdWithCityAndCountry = async (id) => {
  return CenterModel.findAll({
    where: {
      id: id
    },
    include: [
      {
        model: CountryModel,
        as: 'country',
        attributes: ['name']
      },
      {
        model: CityModel,
        as: 'city',
        attributes: ['name'],
      }]
  });
};

/**
 * Update Center by id
 * @param {ObjectId} CenterId
 * @param {Object} updateBody
 * @returns {Promise<CenterModel>}
 */
const updateCenterById = async (CenterId, updateBody, updatedBy) => {
  const Center = await getCenterById(CenterId);
  if (!Center) {
    throw new ApiError(httpStatus.NOT_FOUND, "Center not found");
  }
  updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Center, updateBody);
  await Center.save();
  const updatedCenter = await getCenterByIdWithCityAndCountry(CenterId)
  return updatedCenter;
};

/**
 * Delete Center by id
 * @param {ObjectId} CenterId
 * @returns {Promise<CenterModel>}
 */
const deleteCenterById = async (CenterId, deleteBody, updatedBy) => {
  const Center = await getCenterById(CenterId);
  if (!Center) {
    throw new ApiError(httpStatus.NOT_FOUND, "Center not found");
  }
  // Get SubCenter with CenterId and IsActive, to check whether Center has got SubCenters
  getSubCenters = await SubCenterModel.findAll({
    where: {
      centerId: deleteBody.id,
      isActive: true
    }
  })
  if(getSubCenters.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Center cannot be mark Inactive, please ensure all the respective subcenters are marked Inactive"); 
  } else {
    deleteBody.updatedBy = updatedBy;
    deleteBody.isActive = !Center.isActive;
    delete deleteBody.id;
    Object.assign(Center, deleteBody);
    const updatedCenter = await Center.save();
    return getCenterById(updatedCenter.id)
  }
  // await Center.destroy();
  // return Center;
};

module.exports = {
  createCenter,
  queryCenters,
  getCenterById,
  updateCenterById,
  deleteCenterById,
};

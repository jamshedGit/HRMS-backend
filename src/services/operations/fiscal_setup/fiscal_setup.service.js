const httpStatus = require("http-status");
const axios = require("axios")
const  FiscalSetupModel  = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts, check_range_exist, formatDates } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} FiscalSetupBody
 * @returns {Promise<FiscalSetup>}
 */
const createFiscalSetup = async (req, FiscalSetupBody) => {
  FiscalSetupBody.startDate= formatDates(FiscalSetupBody.startDate, 'yyyy-MM-dd')
  FiscalSetupBody.endDate=formatDates(FiscalSetupBody.endDate, 'yyyy-MM-dd')


  // FiscalSetupBody.slug = FiscalSetupBody.name.replace(/ /g, "-").toLowerCase();

  FiscalSetupBody.createdBy = req.user.id;
  
  const existingRange = await check_range_exist(
    FiscalSetupBody,
    "FiscalSetupModel",
    "startDate",
    "endDate",
    (fieldMappings = ["subsidiaryId"])
  );

  if (existingRange) {

    let result = {
      message: "Unable to Save: Fiscal setup overlaps with existing date.",
      status: "error",
    };
    return result;

  }

  // const resp = await sequelize.query(' update t_tax_setup set isActive = 0');

  // If the subsidiary exists, proceed to update the t_tax_setup table
 
  if (FiscalSetupBody?.subsidiaryId) {
    // Update the tax setup where subsidiaryId matches
    const [updatedRowsCount] = await FiscalSetupModel?.FiscalSetupModel.update(
      { isActive: 0 }, // Set isActive to 0
      {
        where: {
          subsidiaryId: FiscalSetupBody?.subsidiaryId,  // Match subsidiaryId
          isActive: 1                               // Ensure isActive is 1
        }
      }
    );
  }


  // const resp = await sequelize.query(' update t_Fiscal_setup set isActive = 0');

  const addedFiscalSetupObj = await FiscalSetupModel.FiscalSetupModel.create(FiscalSetupBody);
  //authSMSSend(addedFiscalSetupObj.dataValues);  // Quick send message at the time of donation
  return addedFiscalSetupObj;
};



/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFiscalSetups = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { startDate: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('startDate')), 'LIKE', '%' + searchQuery + '%') },
    { endDate: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('endDate')), 'LIKE', '%' + searchQuery + '%') },
    { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subs.name')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await FiscalSetupModel.FiscalSetupModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: FiscalSetupModel.SubsidiaryModel,
        attributes: ["Id", ["name", "subsName"]],
        as: "subs"
      }
    ],
  });


  return paginationFacts(count, limit, options.pageNumber, rows);
  
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getFiscalSetupById = async (id) => {
  return FiscalSetupModel.FiscalSetupModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateFiscalSetupById = async (Id, updateBody, updatedBy) => {

  const Item = await getFiscalSetupById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }
 
  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return  ;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
  const deleteFiscalSetupById = async (Id) => {

  const Item = await getFiscalSetupById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createFiscalSetup,
  queryFiscalSetups,
  getFiscalSetupById,
  updateFiscalSetupById,
  deleteFiscalSetupById
};

const httpStatus = require("http-status");
const axios = require("axios")
const BankModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts, currentSubsidiaryPermission } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} BankBody
 * @returns {Promise<Bank>}
 */
const createBank = async (req, BankBody) => {

  BankBody.createdBy = req.user.Id;
  BankBody.Name=BankBody.Name.trimStart();
  BankBody.companyId=req.user.companyId;
  const addedBankObj = await BankModel.BankModel.create(BankBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation
  const fetchRecord = await getBankById(addedBankObj.Id);
  return fetchRecord;
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
const queryBanks = async (req,filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subs.name')), 'LIKE', '%' + searchQuery + '%') },
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('t_bank.Name')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await BankModel.BankModel.findAndCountAll({
    // order: [
    //   ['createdAt', 'DESC']
    // ],

    order: [
      [Sequelize.col("subs.name"), "ASC"],   // Order by Subsidiary name
     
    ],
    where: {
      [Op.or]: queryFilters,
      subsidiaryId: {
        [Op.in]: await currentSubsidiaryPermission(req)  // Use the Op.in operator here
      } 
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: BankModel.SubsidiaryModel,
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
const getBankById = async (id) => {
  return BankModel.BankModel.findByPk(id, {
    include: [
      {
        model: BankModel.SubsidiaryModel,
        attributes: ["Id", ["name", "subsName"]],
        as: "subs"
      }
    ],
  });
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateBankById = async (Id, updateBody, updatedBy) => {
  try {


    const Item = await getBankById(Id);
    if (!Item) {
      throw new ApiError(httpStatus.NOT_FOUND, "record not found");
    }

    updateBody.updatedBy = updatedBy;
    updateBody.Name=updateBody.Name.trimStart();
    delete updateBody.id;
    Object.assign(Item, updateBody);
    await Item.save();
  } catch (error) {
  
    if (error?.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
  return;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
const deleteBankById = async (Id) => {

  const Item = await getBankById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createBank,
  queryBanks,
  getBankById,
  updateBankById,
  deleteBankById
};

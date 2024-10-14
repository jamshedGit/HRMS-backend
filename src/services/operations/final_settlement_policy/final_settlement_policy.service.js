const httpStatus = require("http-status");
const axios = require("axios")
const FinalSettlementModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} FinalSettlementBody
 * @returns {Promise<FinalSettlementPolicy>}
 */
const createFinalSettlement = async (req, FinalSettlementBody) => {
  console.log("Final Settlement Body", FinalSettlementBody)
  // FinalSettlementBody.slug = FinalSettlementBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  FinalSettlementBody.createdBy = req.user.id;
  console.log(FinalSettlementBody, "body");
  const addedFinalSettlementObj = await FinalSettlementModel.FinalSettlementModel.create(FinalSettlementBody);
  //authSMSSend(addedFinalSettlementObj.dataValues);  // Quick send message at the time of donation
  return addedFinalSettlementObj;
};

const usp_GetAllFinalSettlementsPolicy = async () => {
  try {
    
    const results = await sequelize.query('CALL usp_GetAllFinalSettlementsPolicy()', {
     
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
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
const queryFinalSettlements = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('companyId')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await FinalSettlementModel.FinalSettlementModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
  });


  return paginationFacts(count, limit, options.pageNumber, rows);

};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getFinalSettlementById = async (id) => {
  return FinalSettlementModel.FinalSettlementModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateFinalSettlementById = async (Id, updateBody, updatedBy) => {

  const Item = await getFinalSettlementById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }
  //console.log("Update Receipt Id" , item);
  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
const deleteFinalSettlementById = async (Id) => {

  const Item = await getFinalSettlementById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};


const usp_InsertFinalSettlementPolicy = async (earningObjList, policyObj) => {
  try {
    console.log("world", earningObjList, policyObj)
   
    const list = earningObjList.map((x) => {
      console.log("test ", x.earning_Id);
      return { ...policyObj, earning_Id: x.earning_Id }
    })



    const resp = await sequelize.query('delete from t_final_settlement_policy');

    list.forEach(async element => {

     
      const results = await sequelize.query('CALL usp_InsertFinalSettlementPolicy(:p_companyId,:p_subsidiaryId,:p_divisor,:p_multiplier,:p_value,:p_type,:p_earning_Id,:p_createdBy)', {
        replacements: {
          p_companyId: 1, // element.companyId || 0, 
          p_subsidiaryId: 1, // element.subsidiaryId || 0, 
          p_divisor: element.divisor || 0,
          p_type: element.type || 'null',
          p_createdBy: element.earning_deduction_id,
          p_multiplier: element.multiplier,
          p_value: element.value,
          p_earning_Id: element.earning_Id || 0,
          p_createdBy: 1
        },
        type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
      });

    });


    return [];
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};



module.exports = {
  createFinalSettlement,
  queryFinalSettlements,
  getFinalSettlementById,
  updateFinalSettlementById,
  deleteFinalSettlementById,
  usp_InsertFinalSettlementPolicy,
  usp_GetAllFinalSettlementsPolicy
};

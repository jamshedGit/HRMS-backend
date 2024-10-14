const httpStatus = require("http-status");
const axios = require("axios")
const OneTimeEarningModel = require("../../../models/index");
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
 * @param {Object} OneTimeEarningBody
 * @returns {Promise<OneTimeEarningPolicy>}
 */
const createOneTimeEarning = async (req, OneTimeEarningBody) => {
  console.log("Final Settlement Body", OneTimeEarningBody)
  // OneTimeEarningBody.slug = OneTimeEarningBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  OneTimeEarningBody.createdBy = req.user.id;
  console.log(OneTimeEarningBody, "body");
  const addedOneTimeEarningObj = await OneTimeEarningModel.OneTimeAllowance.create(OneTimeEarningBody);
  //authSMSSend(addedOneTimeEarningObj.dataValues);  // Quick send message at the time of donation
  return addedOneTimeEarningObj;
};

const usp_GetAllOnetimeAllowanceDetails = async (employeeId) => {
  try {
    console.log('val::', employeeId);
    const results = await sequelize.query('CALL usp_GetAllOnetimeAllowanceDetails(:p_employeeId)', {
      replacements: {
        p_employeeId: employeeId || 'null',
      },
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
const queryOneTimeEarnings = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('employeeId')), 'LIKE', '%' + searchQuery + '%') },
  ]
  const { count, rows } = await OneTimeEarningModel.OneTimeAllowance.findAndCountAll({
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
const getOneTimeEarningById = async (id) => {
  return OneTimeEarningModel.OneTimeAllowance.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateOneTimeEarningById = async (Id, updateBody, updatedBy) => {

  const Item = await getOneTimeEarningById(Id);
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
const deleteOneTimeEarningById = async (Id) => {

  const Item = await getOneTimeEarningById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};


const usp_InsertOneTimeEarningPolicy = async (valueObj, earningObjList,) => {
  try {
    console.log("world", earningObjList)

    // const list = earningObjList.map((x) => {
    //   console.log("test ", x.earning_Id);
    //   return { ...earningObjList, earning_Id: x.earning_Id }
    // })

    //console.log("::temp",list)

    const resp = await sequelize.query('delete from t_onetime_earning where employeeId = ' + valueObj.employeeId);

    earningObjList.forEach(async element => {
      console.log(":list::", element.amount); 

      const results = await sequelize.query('CALL usp_InsertOnetimeAllowance(:p_employeeId,:p_earningId,:p_month,:p_amount,:p_remarks,:p_createdBy,:p_subsidiaryId,:p_companyId,:p_transactionType)', {
        replacements: {
          p_companyId: 1, // element.companyId || 0, 
          p_subsidiaryId: 1, // element.subsidiaryId || 0, 
          p_employeeId: valueObj.employeeId || 0,
          p_earningId: element.earning_Id || 0,
          p_month: element.month || null,
          p_amount: element.amount || 0,
          p_remarks: element.remarks || '',
          p_createdBy: element.createdBy || 0,
          p_transactionType: element.transactionType || ''
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
  createOneTimeEarning,
  queryOneTimeEarnings,
  getOneTimeEarningById,
  updateOneTimeEarningById,
  deleteOneTimeEarningById,
  usp_InsertOneTimeEarningPolicy,
  usp_GetAllOnetimeAllowanceDetails
};

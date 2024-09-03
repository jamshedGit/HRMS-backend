const httpStatus = require("http-status");
const axios = require("axios")
const Compensation_BeneftisModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns');
const { date } = require("joi");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} Compensation_BeneftisBody
 * @returns {Promise<Compensation_Beneftis>}
 */
const createCompensation_Beneftis = async (req, Compensation_BeneftisBody) => {

  try {
    console.log("Compensation_Beneftis Body", Compensation_BeneftisBody)
    // Compensation_BeneftisBody.slug = Compensation_BeneftisBody.name.replace(/ /g, "-").toLowerCase();
    console.log(req.user.id);
    Compensation_BeneftisBody.createdBy = req.user.id;
    console.log(Compensation_BeneftisBody, "body");
    const addedCompensation_BeneftisObj = await Compensation_BeneftisModel.CompensationBenefitsModel.create(Compensation_BeneftisBody);
    //authSMSSend(addedCompensation_BeneftisObj.dataValues);  // Quick send message at the time of donation
    return addedCompensation_BeneftisObj;

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
const queryCompensation_Beneftiss = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('skill')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await Compensation_BeneftisModel.Compensation_BeneftisModel.findAndCountAll({
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

const SP_getAllCompensation_BeneftisInfo = async (filter, options, searchQuery, pkId) => {
  try {
    const results = await sequelize.query('CALL usp_GetAllCompensationBenefitsPolicy(:pkId)', {
      replacements: { pkId: pkId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit;
    searchQuery = searchQuery.toLowerCase();
    let searchlist = filterByValue(results, searchQuery);
    console.log("searchlist", searchlist)
    let count = searchlist.length;
    const rows = searchlist.slice(offset, offset + limit)

    return paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const SP_getAllCompensation_BeneftisForDDL = async (pkId) => {
  try {
    const results = await sequelize.query('CALL usp_GetAllCompensationBenefitsForDDL()', {
      replacements: { pkId: pkId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const SP_getAllCompensation_BeneftisInfoByEmpId = async (pkId) => {
  try {
    console.log("compensation pkId", pkId);
    const results = await sequelize.query('CALL usp_GetAllCompensationBenefitsPolicy(:pkId)', {
      replacements: { pkId: pkId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    console.log("dj", results);
    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const sp_getall_earning_deduction_transaction_bycompensatioPKID = async (compensationPkId, transactionType) => {
  try {
    console.log("usp_GetAllEarningDeductionTransaction", transactionType);
    const results = await sequelize.query('CALL usp_GetAllEarningDeductionTransaction(:id,:transactionType)', {
      replacements: { id: compensationPkId || 'null', transactionType: transactionType },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    console.log("dj", results);
    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const usp_GetAllCompensation_Earning_Deduction_ById = async (compensationId) => {
  try {
    console.log("usp_GetCompensation_EarningDeduction_ByID", compensationId);
    const results = await sequelize.query('CALL usp_GetCompensation_EarningDeduction_ByID(:Id)', {
      replacements: { Id: compensationId },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    console.log("dj", results);
    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};




const update_compensation_heads_bulk = async (arr, compensationId) => {
  try {

    console.log("res delete", arr, compensationId);

    const resp = await sequelize.query('delete from t_compensation_earning_deduction where compensation_benefits_Id =' + compensationId || 0);

    arr.forEach(async element => {

      const results = await sequelize.query('CALL usp_update_compensation_earningDeductionBulk(:compensation_benefits_Id,:subsidiaryId,:factorVal,:earning_deduction_id,:transactionType,:calculation_type,:isPartOfGrossSalary,:amount,:createdBy)', {
        replacements: {
          compensation_benefits_Id: compensationId,
          subsidiaryId: element.subsidiaryId || 0,
          factorVal: element.factorValue || 0,
          earning_deduction_id: element.earning_deduction_id || 0,
          transactionType: element.transactionType || '',
          calculation_type: element.calculation_type || '',
          isPartOfGrossSalary: element.isPartOfGrossSalary || false,
          amount: element.amount || 0,
          createdBy: element.createdBy || 0
        },
        type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
      });

    });

    return [];
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['earningName'].toLowerCase().includes(string.toLowerCase()) || o['deductionName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getCompensation_BeneftisById = async (id) => {
  console.log("getCompensation_BeneftisById", id)
  return Compensation_BeneftisModel.CompensationBenefitsModel.findByPk(id);
};


const GetCompensationDetailsByAttr = async (subsidiaryId, gradeId, employeeTypeId, currencyId) => {
  try {
    console.log("GetCompensationDetailsByAttr", subsidiaryId);
    const results = await sequelize.query('CALL usp_GetAllCompensationPolicyDetails(:subsidiaryId,:gradeId,:employeeTypeId,:currencyId)', {
      replacements:
      {
        subsidiaryId: subsidiaryId,
        gradeId: gradeId,
        employeeTypeId: employeeTypeId,
        currencyId: currencyId
      },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    console.log("dj", results);
    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateCompensation_BeneftisById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getCompensation_BeneftisById(Id);
  console.log("update com item", Item);
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
const deleteCompensation_BeneftisById = async (Id) => {

  const Item = await getCompensation_BeneftisById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createCompensation_Beneftis,
  queryCompensation_Beneftiss,
  getCompensation_BeneftisById,
  updateCompensation_BeneftisById,
  deleteCompensation_BeneftisById,
  SP_getAllCompensation_BeneftisInfo,
  SP_getAllCompensation_BeneftisInfoByEmpId,
  SP_getAllCompensation_BeneftisForDDL,
  sp_getall_earning_deduction_transaction_bycompensatioPKID,
  update_compensation_heads_bulk,
  usp_GetAllCompensation_Earning_Deduction_ById,
  GetCompensationDetailsByAttr
};

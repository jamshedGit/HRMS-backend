const httpStatus = require("http-status");
const axios = require("axios")
const {LoanTypeModel,LoanTypeSetupAccess, SubsidiaryModel, FormModel} = require("../../../models/index");
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
 * @param {Object} LoanTypeBody
 * @returns {Promise<LoanType>}
 */
const createLoanType = async (req, LoanTypeBody) => {
  
  // LoanTypeBody.slug = LoanTypeBody.name.replace(/ /g, "-").toLowerCase();

  LoanTypeBody.createdBy = req.user.id;
  LoanTypeBody.name=LoanTypeBody.name.trimStart();
  
  const addedLoanTypeObj = await LoanTypeModel.create(LoanTypeBody);
  if (addedLoanTypeObj) {
    for (const subId of addedLoanTypeObj.subsidiaryId) {
      await LoanTypeSetupAccess.create({
        loan_typeSetupId: addedLoanTypeObj.Id,
        subsidiaryId: subId,
      })
    }
  }
  return addedLoanTypeObj;

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
const queryLoanTypes = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subsList.name')), 'LIKE', '%' + searchQuery + '%') },
    { code: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('code')), 'LIKE', '%' + searchQuery + '%') },
    { loanName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('t_loan_type_setup.name')), 'LIKE', '%' + searchQuery + '%') },
    { accountName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('LoanTypeAccount.formCode')), 'LIKE', '%' + searchQuery + '%') },
    { accountCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('LoanTypeAccount.formName')), 'LIKE', '%' + searchQuery + '%') },
  ]
  const { count, rows } = await LoanTypeModel.findAndCountAll({
    // order: [
    //   [Sequelize.col("subsList.name"), "ASC"],   // Order by Subsidiary name
     
    // ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      // {
      //   model: SubsidiaryModel,
      //   attributes: ["Id", ["name", "subsName"]],
      //   as: "subsList"
      // },
      {
        model:FormModel,
        attributes: ["formName", "formCode"],
        as: "LoanTypeAccount",
      },
    
    ],
    // include: [
    //   {
    //     model: LoanTypeModel.FormModel,
    //     attributes: ["formName", "formCode"],
    //     as: "LoanTypeAccount",
    //   },
    // ],
  });


  return paginationFacts(count, limit, options.pageNumber, rows);

};

const SP_getAllLoanTypeInfo = async (filter, options, searchQuery,empId) => {
  try {

    const results = await sequelize.query('CALL usp_GetAllLoanTypesByEmpId(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
  

    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit;
    searchQuery = searchQuery.toLowerCase();
    let searchlist = filterByValue(results, searchQuery);
   
    let count = searchlist.length;
    const rows = searchlist.slice(offset, offset + limit)
    
    return paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const SP_getAllLoanTypeInfoByEmpId = async (empId) => {
  try {
 
    const results = await sequelize.query('CALL usp_GetAllLoanTypesByEmpId(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['LoanTypeCode'].toLowerCase().includes(string.toLowerCase()) || o['LoanTypeName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getLoanTypeById = async (id) => {

  return LoanTypeModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
// const updateLoanTypeById = async (Id, updateBody, updatedBy) => {

  
//   const Item = await getLoanTypeById(Id);
//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "record not found");
//   }
//   // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
//   updateBody.updatedBy = updatedBy;
//   updateBody.name=updateBody.name.trimStart();
//   delete updateBody.id;
//   Object.assign(Item, updateBody);
//   await Item.save();
//   return;
// };

const updateLoanTypeById = async (Id, updateBody, updatedBy) => {
 
  try {


    const Item = await getLoanTypeById(Id);

    if (!Item) {
      throw new ApiError(httpStatus.NOT_FOUND, "record not found");
    }

    updateBody.updatedBy = updatedBy;
    delete updateBody.Id;
    Object.assign(Item, updateBody);

    updatedData= await Item.save();
    if (updatedData) {
    
     
        await LoanTypeSetupAccess.destroy({ where: { loan_typeSetupId: updatedData.Id } })
      // }
   
      for (const subId of updatedData.subsidiaryId) {
        await LoanTypeSetupAccess.create({
          loan_typeSetupId: updatedData.Id,
          subsidiaryId: subId,
        
        })
      }
    }
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
const deleteLoanTypeById = async (Id) => {

  const Item = await getLoanTypeById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createLoanType,
  queryLoanTypes,
  getLoanTypeById,
  updateLoanTypeById,
  deleteLoanTypeById,
  SP_getAllLoanTypeInfo,
  SP_getAllLoanTypeInfoByEmpId
};

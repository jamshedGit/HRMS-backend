const httpStatus = require("http-status");
const axios = require("axios")
const {DeductionModel,DeductionSetupAccessModel, SubsidiaryModel, FormModel} = require("../../../models/index");
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
 * @param {Object} DeductionBody
 * @returns {Promise<Deduction>}
 */
const createDeduction = async (req, DeductionBody) => {
  
  // DeductionBody.slug = DeductionBody.name.replace(/ /g, "-").toLowerCase();

  DeductionBody.createdBy = req.user.Id;
  DeductionBody.deductionName=DeductionBody.deductionName.trimStart();
  DeductionBody.companyId=req.user.companyId;
  const addedDeductionObj = await DeductionModel.create(DeductionBody);
    //authSMSSend(addedEarningObj.dataValues);  // Quick send message at the time of donation
    if (addedDeductionObj) {
      for (const subId of addedDeductionObj.subsidiaryId) {
        await DeductionSetupAccessModel.create({
          deductionSetupId: addedDeductionObj.Id,
          subsidiaryId: subId,
        })
      }
    }
  return addedDeductionObj;



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
const queryDeductions = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { deductionCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('deductionCode')), 'LIKE', '%' + searchQuery + '%') },
    { deductionName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('deductionName')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await DeductionModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
    // include: [
    //   {
    //     model: SubsidiaryModel,
    //     attributes: ["Id", ["name", "subsName"]],
    //     as: "subsList"
    //   }
    // ],
    
  });


  return paginationFacts(count, limit, options.pageNumber, rows);

};

const SP_getAllDeductionInfo = async (req,filter, options, searchQuery,empId) => {
  try {
   
    // const results = await sequelize.query('CALL usp_GetAllDeductionsByEmpId(:employeeId)', {
    //   replacements: { employeeId: empId || 'null' },
    //   type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    // });

    const results = await DeductionModel.findAll({
      where: {
        companyId: req.user.companyId
      },
      attributes: [
        'Id',
        'subsidiaryid',
        'deductionCode',
        'deductionName',
        "mappedDeduction",
        "account",
        'isActive',
        'createdBy',
        'createdAt',
        'updatedBy',
        'updatedAt',
        // [sequelize.col('subsidiary.name'), 'subsidiary'], // Get the subsidiary name
        // Simplified CASE statements using sequelize.fn and sequelize.col
        [
          sequelize.fn('IF', sequelize.col('linkedAttendance'), 'Yes', 'No'), 
          'linkedAttendance',
        ],
        [
          sequelize.fn('IF', sequelize.col('loan'), 'Yes', 'No'), 
          'loan',
        ],
        
        [
          sequelize.fn('CONCAT', sequelize.col('Account.formCode'), ' - ', sequelize.col('Account.formName')),
          'account',
        ],
      ],
      include: [
      
        {
          model: FormModel,
          attributes: ["formName", "formCode"],
          as: "Account",
        },

      ],
      // Optional: add any filters, such as `where` or `order`, depending on your use case
    });

console.log("results111",results)
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


const SP_getAllDeductionInfoByEmpId = async (empId) => {
  try {

    const results = await sequelize.query('CALL usp_GetAllDeductionsByEmpId(:employeeId)', {
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
    return o['deductionCode'].toLowerCase().includes(string.toLowerCase()) 
    || o['deductionName'].toLowerCase().includes(string.toLowerCase()) 
    // || o['subsidiary'].toLowerCase().includes(string.toLowerCase())
    || o['account'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getDeductionById = async (id) => {
  return DeductionModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
// const updateDeductionById = async (Id, updateBody, updatedBy) => {


//   const Item = await getDeductionById(Id);
//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "record not found");
//   }

//   // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()

//   updateBody.updatedBy = updatedBy;
//   delete updateBody.id;
//   Object.assign(Item, updateBody);
//   await Item.save();
//   return;
// };



const updateDeductionById = async (Id, updateBody, updatedBy) => {
 
  try {


    const Item = await getDeductionById(Id);

    if (!Item) {
      throw new ApiError(httpStatus.NOT_FOUND, "record not found");
    }

    updateBody.updatedBy = updatedBy;
    delete updateBody.Id;
    Object.assign(Item, updateBody);

    updatedData= await Item.save();
    if (updatedData) {
    
     
        await DeductionSetupAccessModel.destroy({ where: { deductionSetupId: updatedData.Id } })
      // }
   
      for (const subId of updatedData.subsidiaryId) {
        await DeductionSetupAccessModel.create({
          deductionSetupId: updatedData.Id,
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
const deleteDeductionById = async (Id) => {

  const Item = await getDeductionById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createDeduction,
  queryDeductions,
  getDeductionById,
  updateDeductionById,
  deleteDeductionById,
  SP_getAllDeductionInfo,
  SP_getAllDeductionInfoByEmpId
};

const httpStatus = require("http-status");
const axios = require("axios")
const EmpPolicyModel= require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns');
const { HttpResponseMessages } = require("../../../utils/constants");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} EmpPolicyBody
 * @returns {Promise<Bank>}
 */
const createEmpPolicy = async (req, EmpPolicyBody) => {

  // EmpPolicyBody.slug = EmpPolicyBody.name.replace(/ /g, "-").toLowerCase();

  EmpPolicyBody.createdBy = req.user.Id;
  EmpPolicyBody.companyId=req.user.companyId
  const addedEmpPolicyObj = await EmpPolicyModel.EmployeePolicyModel.create(EmpPolicyBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation
  return addedEmpPolicyObj;
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
// const queryEmpPolicy = async (filter, options, searchQuery) => {



//   let limit = options.pageSize;
//   let offset = 0 + (options.pageNumber - 1) * limit;

//   searchQuery = searchQuery.toLowerCase();
//   const queryFilters = [
//     // { isActive: sequelize.where }
//     // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },

//     { code: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('code')), 'LIKE', '%' + searchQuery + '%') },

//   ]


//   const { count, rows } = await EmpPolicyModel.EmployeePolicyModel.findAndCountAll({
//     order: [
//       ['createdAt', 'DESC']
//     ],
//     where: {
//       [Op.or]: queryFilters,
//       // isActive: true
//     },
//     offset: offset,
//     limit: limit,
//     // include: [
//     //   {
//     //     model: EmpPolicyModel.SubsidiaryModel,
//     //     attributes: ["Id","name"],
//     //     as: "Subsidiary",
//     //   },
//     // ]
//   });


//   return paginationFacts(count, limit, options.pageNumber, rows);
//   // return Items;
// };


const queryEmpPolicy = async (req,filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('minimumAge')), 'LIKE', '%' + searchQuery + '%') },
  
  ]

  const { count, rows } = await EmpPolicyModel.EmployeePolicyModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],

    // order: [
    //   [Sequelize.col("subs.name"), "ASC"],   // Order by Subsidiary name
     
    // ],
    where: {
      [Op.or]: queryFilters,
      companyId:req.user.companyId,
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: EmpPolicyModel.SubsidiaryModel,
        attributes: ["Id","name"],
        as: "Subsidiary"
      },
      {
        model: EmpPolicyModel.FormModel,
        attributes: ["Id","formName","formCode"],
        as: "Currency"
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
const getEmpPolicyById = async (id) => {

  return EmpPolicyModel.EmployeePolicyModel.findByPk(id);
};


const usp_GetEmpPolicyBySubsidiaryId = async (subsidiaryId) => {
  try {
 
    const results = await sequelize.query('CALL usp_GetEmpPolicyBySubsidiaryId(:p_subsidiaryId)', {
      replacements: { p_subsidiaryId: subsidiaryId || null},
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
    // let limit = options.pageSize;
    // let offset = 0 + (options.pageNumber - 1) * limit;
    // searchQuery = searchQuery.toLowerCase();
    // let searchlist = filterByValue(results, searchQuery);

    // let count = searchlist.length;
    // const rows = searchlist.slice(offset, offset + limit)

    return results // paginationFacts(count, limit, options.pageNumber, rows); // 
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
const updateEmpPolicyById = async (Id, updateBody, updatedBy) => {
 

  const Item = await getEmpPolicyById(Id);

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

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
const deleteEmpPolicyById = async (Id) => {

  const Item = await getEmpPolicyById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  if(Item){

    const checkUserExist = await EmpPolicyModel.EmployeeProfileModel.findOne({
      where:{subsidiaryId:Item.subsidiaryId}
    });
    if(checkUserExist){
      throw new ApiError(httpStatus.FORBIDDEN,HttpResponseMessages.ASSOCIATED_RECORD);
    }

  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEmpPolicy,
  queryEmpPolicy,
  getEmpPolicyById,
  updateEmpPolicyById,
  deleteEmpPolicyById,
  usp_GetEmpPolicyBySubsidiaryId
};

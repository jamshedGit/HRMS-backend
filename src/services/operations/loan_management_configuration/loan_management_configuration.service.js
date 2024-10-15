const httpStatus = require("http-status");
const  Loan_management_configurationModel  = require("../../../models/index");
const Loan_management_detailModel =require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");


const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} loan_management_configurationBody
 * @returns {Promise<loan_management_configuration>}
 */




// const createloan_management_configuration = async (req, loan_management_configurationBody) => {
//     console.log("loan_management_configuration Body", loan_management_configurationBody)
//   // loan_management_configurationBody.slug = loan_management_configurationBody.name.replace(/ /g, "-").toLowerCase();
//   console.log(req.user.id);
//   loan_management_configurationBody.createdBy = req.user.id;
//   console.log(loan_management_configurationBody,"body");
//   const addedloan_management_configurationObj = await Loan_management_configurationModel.Loan_management_configurationModel.create(loan_management_configurationBody);
//   //authSMSSend(addedloan_management_configurationObj.dataValues);  // Quick send message at the time of donation
//   return addedloan_management_configurationObj;
// };


// const createloan_management_configuration = async (req, loanManagementConfigurationBody) => {
//   try {
//     loanManagementConfigurationBody.createdBy = req.user.id;
//     console.log(loanManagementConfigurationBody, "body");

//     // Create the loan management configuration
//     // const addedLoanManagementConfigurationObj = await Loan_management_configurationModel.Loan_management_configurationModel.create(loanManagementConfigurationBody);
    
//     const loanDetails = loanManagementConfigurationBody.details.map(detail => ({
//       ...detail,
//       loan_management_configurationId: 1 // Associate with the configuration ID
//     }));

//     for (const detail of loanDetails) {
//       await Loan_management_detailModel.Loan_management_detailModel.create(detail);
//     }

//     return loanDetails; // Return the created configuration
//   } catch (error) {
//     console.error("Error creating loan management configuration:", error);
//     throw error; // Propagate the error for further handling
//   }
// };



const createloan_management_configuration = async (req, loan_management_configurationBody) => {
  try {
   

    loan_management_configurationBody.createdBy = req.user.id;
    console.log(loan_management_configurationBody, "body");

    // Create the loan management configuration
    const addedloan_management_configurationObj = await Loan_management_configurationModel.Loan_management_configurationModel.create(loan_management_configurationBody);

    console.log("addedloan_management_configurationObj Body", loan_management_configurationBody);
    // Check for details and save them
    if (addedloan_management_configurationObj && addedloan_management_configurationObj.Id && loan_management_configurationBody.details && Array.isArray(loan_management_configurationBody.details)) {
      const loanDetails = loan_management_configurationBody.details.map(detail => ({
        ...detail,
        loan_management_configurationId: addedloan_management_configurationObj.Id // Associate with the configuration ID
      }));

 
      for (const detail of loanDetails) {
        await Loan_management_detailModel.Loan_management_detailModel.create(detail);
      }
    }

    return addedloan_management_configurationObj;
  } catch (error) {
    console.error("Error creating loan management configuration:", error);
    throw error; // Rethrow or handle the error as needed
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
const queryloan_management_configuration = async (filter, options, searchQuery) => {
  
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { emp_loan_account: Sequelize.where(Sequelize.fn('', Sequelize.col('emp_loan_account')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await Loan_management_configurationModel.Loan_management_configurationModel.findAndCountAll({
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
          model:Loan_management_detailModel.Loan_management_detailModel, 
          as: 'Details', 
          // attributes:["I"]
       
      }
  ]
  });


  return paginationFacts(count, limit, options.pageNumber, rows);
  
};



const getAllRoundingPolicies = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get Search field value for filtering
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('formName')), 'LIKE', '%' + searchQuery + '%') },
  ]
 
  const { count, rows } = await RoundingPolicyModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: roundingAttribute,
    include: [{
      where: {
        [Op.or]: queryFilters,
      },
      model: FormModel,
      attributes: ['formName']  // Only fetch the 'name' field from table `b`
    }],
    offset: offset,
    limit: limit,
  });
 
  //If Include is present in the query the returned data from the other table are under the key of table name. So we use handleNestedData
  const updatedRows = handleNestedData(rows)
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};


/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getloan_management_configurationById = async (id) => {
  return Loan_management_configurationModel.Loan_management_configurationModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */


const updateloan_management_configurationById = async (Id, updateBody, updatedBy) => {

    const Item = await getloan_management_configurationById(Id);
    if (!Item) {
      throw new ApiError(httpStatus.NOT_FOUND, "record not found");
    }
    //console.log("Update Receipt Id" , item);
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
  const deleteloan_management_configurationById = async (Id) => {

  const Item = await getloan_management_configurationById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createloan_management_configuration,
  queryloan_management_configuration,
  getloan_management_configurationById,
  updateloan_management_configurationById,
  deleteloan_management_configurationById
};

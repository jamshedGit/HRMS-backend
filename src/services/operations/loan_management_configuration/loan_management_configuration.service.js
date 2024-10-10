const httpStatus = require("http-status");
const  Loan_management_configurationModel  = require("../../../models/index");
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




const createloan_management_configuration = async (req, loan_management_configurationBody) => {
    console.log("loan_management_configuration Body", loan_management_configurationBody)
  // loan_management_configurationBody.slug = loan_management_configurationBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  loan_management_configurationBody.createdBy = req.user.id;
  console.log(loan_management_configurationBody,"body");
  const addedloan_management_configurationObj = await Loan_management_configurationModel.Loan_management_configurationModel.create(loan_management_configurationBody);
  //authSMSSend(addedloan_management_configurationObj.dataValues);  // Quick send message at the time of donation
  return addedloan_management_configurationObj;
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
  });


  return paginationFacts(count, limit, options.pageNumber, rows);
  
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

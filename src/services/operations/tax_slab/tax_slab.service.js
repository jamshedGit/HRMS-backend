const httpStatus = require("http-status");
const  Tax_slabModel  = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");


const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} tax_slabBody
 * @returns {Promise<tax_slab>}
 */
// const createtax_slab = async (req, tax_slabBody) => {


//   tax_slabBody.createdBy = req.user.id;

//   const addedtax_slabObj = await Tax_slabModel.Tax_slabModel.create(tax_slabBody);
//   //authSMSSend(addedtax_slabObj.dataValues);  // Quick send message at the time of donation
//   return addedtax_slabObj;
// };



// const createtax_slab = async (req, tax_slabBody) => {
//     tax_slabBody.createdBy = req.user.id;
  
//     const { from_amount, to_amount } = tax_slabBody;
  
//     // Check for existing records that overlap with the new record
//     const existingSlab = await Tax_slabModel.Tax_slabModel.findOne({
//       where: {
//         [Op.or]: [
//           { from_amount: { [Op.between]: [from_amount, to_amount] } },
//           { to_amount: { [Op.between]: [from_amount, to_amount] } },
//           { from_amount: { [Op.lte]: from_amount }, to_amount: { [Op.gte]: to_amount } }
//         ]
//       }
//     });
  
//     if (existingSlab) {
//     //   throw new Error('New tax slab overlaps with existing slabs. Cannot insert the record.');
//       return  'New tax slab overlaps with existing slabs. Cannot insert the record.';
//     }
//     tax_slabBody.createdBy = req.user.id;
//     const addedtax_slabObj = await Tax_slabModel.Tax_slabModel.create(tax_slabBody);
//     console.log("addedtax_slabObj",addedtax_slabObj)
//     // authSMSSend(addedtax_slabObj.dataValues);  // Quick send message at the time of donation
//     return addedtax_slabObj;
//   };
  

const createtax_slab = async (req, tax_slabBody) => {
    tax_slabBody.createdBy = req.user.id;

    const { from_amount, to_amount } = tax_slabBody;

    // Validate that from_amount is less than to_amount
    if (from_amount >= to_amount) {
        return 'from_amount must be less than to_amount';
    }

    // Check for existing records that overlap with the new record
    const existingSlab = await Tax_slabModel.Tax_slabModel.findOne({
        where: {
            [Op.or]: [
                { from_amount: { [Op.between]: [from_amount, to_amount] } },
                { to_amount: { [Op.between]: [from_amount, to_amount] } },
                { from_amount: { [Op.lte]: from_amount }, to_amount: { [Op.gte]: to_amount } }
            ]
        }
    });

    if (existingSlab) {
        return 'New tax slab overlaps with existing slabs. Cannot insert the record.';
    }

    const addedtax_slabObj = await Tax_slabModel.Tax_slabModel.create(tax_slabBody);
    console.log("addedtax_slabObj", addedtax_slabObj);
    // authSMSSend(addedtax_slabObj.dataValues);  // Quick send message at the time of donation
    return addedtax_slabObj;
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
const querytax_slab = async (filter, options, searchQuery) => {
  
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { from_amount: Sequelize.where(Sequelize.fn('', Sequelize.col('from_amount')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await Tax_slabModel.Tax_slabModel.findAndCountAll({
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
const gettax_slabById = async (id) => {
  return Tax_slabModel.Tax_slabModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */



const updatetax_slabById = async (Id, updateBody, updatedBy) => {
    const Item = await gettax_slabById(Id);
    if (!Item) {
        throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
    }

    const { from_amount, to_amount } = updateBody;

    if (from_amount >= to_amount) {
        return 'from_amount must be less than to_amount';
    }


    const overlappingSlab = await Tax_slabModel.Tax_slabModel.findOne({
        where: {
            id: { [Op.ne]: Id },
          [Op.or]: [
            { from_amount: { [Op.between]: [from_amount, to_amount] } },
            { to_amount: { [Op.between]: [from_amount, to_amount] } },
            { from_amount: { [Op.lte]: from_amount }, to_amount: { [Op.gte]: to_amount } }
          ]
        }
      });

    if (overlappingSlab) {
        // throw new ApiError(httpStatus.CONFLICT, "New tax slab overlaps with existing slabs. Cannot update the record.");
    
    return  "New tax slab overlaps with existing slabs. Cannot update the record."
    }

    updateBody.updatedBy = updatedBy;
    delete updateBody.id;  // Optionally keep this if your model has a primary key

    Object.assign(Item, updateBody);
    await Item.save();
    
    return Item;  // Return the updated item
};


/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
  const deletetax_slabById = async (Id) => {

  const Item = await gettax_slabById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createtax_slab,
  querytax_slab,
  gettax_slabById,
  updatetax_slabById,
  deletetax_slabById
};

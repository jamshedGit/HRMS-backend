const httpStatus = require("http-status");
const { Tax_slabModel, TaxSetupModel, SubsidiaryModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, check_range_exist, createTaxYearSetupLabel } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");


const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} tax_slabBody
 * @returns {Promise<tax_slab>}
 */
// const createtax_slab = async (req, tax_slabBody) => {

const get_all_taxYear_setup = async (req, res) => {

  // const result = await TaxSetupModel.findAndCountAll({
  //   order: [
  //     ['createdAt', 'DESC'],
  //   ],
  //   // where: {
  //   //   isActive: true,
  //   // },
  //   attributes: ['Id', 'subsidiaryId', 'isActive','startDate','endDate'],
  
  // });
  
  const result = []
  const yearData = await TaxSetupModel.findAll({
    attributes: ['Id','subsidiaryId', 'isActive','startDate', 'endDate',]
  });
  if (yearData.length) {
    yearData.forEach(element => {
      if (element.startDate && element.endDate) {
        result.push({
          label: createTaxYearSetupLabel(element.endDate, element.startDate,element.isActive),
          value: element.Id,
          subsidiaryId:element.subsidiaryId,
          isActive:element.isActive
        })
      }
    });
  }

  return { count: result.count, rows: result};
  



}

const createtax_slab = async (req, tax_slabBody) => {
  tax_slabBody.createdBy = req.user.id;


  const { from_amount, to_amount } = tax_slabBody;

  // Validate that from_amount is less than to_amount
  if (from_amount >= to_amount) {

    let result = { "message": 'From Amount must be less than To Amount.', "status": "error" }
    return result;
  }

    const taxSetupExist = await TaxSetupModel.findOne({
    where: {
      id:tax_slabBody?.taxSetupId,
      isActive: true,
      subsidiaryId:tax_slabBody?.subsidiaryId
    },
    attributes: ['Id', 'subsidiaryId', 'isActive'],

  });
  if(!taxSetupExist){
    let result = { "message": 'Incorrect tax setup.', "status": "error" }
    return result;
  }

  // Check for existing records that overlap with the new record
  // const existingSlab = await Tax_slabModel.Tax_slabModel.findOne({
  //     where: {
  //         [Op.or]: [
  //             { from_amount: { [Op.between]: [from_amount, to_amount] } },
  //             { to_amount: { [Op.between]: [from_amount, to_amount] } },
  //             { from_amount: { [Op.lte]: from_amount }, to_amount: { [Op.gte]: to_amount } }
  //         ]
  //     }
  // });

  // const result = await TaxSetupModel.findOne({
  //   where: {
  //     subsidiaryId: tax_slabBody.subsidiaryId, // Add a comma here
  //     isActive: true,
  //   },
  // });
  

  
  const existingSlab = await check_range_exist(
    tax_slabBody,
    "Tax_slabModel",
    "from_amount",
    "to_amount",
    (fieldMappings = ["subsidiaryId", "taxSetupId"])
  );


  if (existingSlab) {

    let result = { "message": 'Record already exist.', "status": "error" }
    return result;
    // return 'New tax slab overlaps with existing slabs. Cannot insert the record.';
    // throw new ApiError(httpStatus.NOT_FOUND, "New tax slab overlaps with existing slabs. Cannot insert the record.");
  }

  const addedtax_slabObj = await Tax_slabModel.create(tax_slabBody);

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
 * 
 * 
 */



//Original
// const querytax_slab = async (filter, options, searchQuery) => {

//   let limit = options.pageSize;
//   let offset = 0 + (options.pageNumber - 1) * limit;

//   searchQuery = searchQuery.toLowerCase();
//   const queryFilters = [
//     { from_amount: Sequelize.where(Sequelize.fn('', Sequelize.col('from_amount')), 'LIKE', '%' + searchQuery + '%') },
//     {
//       '$subsidiary.name$': { [Sequelize.Op.like]: '%' + searchQuery + '%' }  
//     },
//   ]


//   const { count, rows } = await Tax_slabModel.findAndCountAll({
//     order: [
//       ['from_amount', 'ASC']
//     ],
//     where: {
//       [Op.or]: queryFilters,
//       // isActive: true
//     },
//     offset: offset,
//     limit: limit,
//     include: [
//       {
//         model: SubsidiaryModel,
//         attributes: ["name"],
//         as: "Subsidiary",
//       },
//     ]
//   });


//   return paginationFacts(count, limit, options.pageNumber, rows);

// };


const querytax_slab = async (filter, options, searchQuery, subsidiaryId,taxSetupId) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { from_amount: Sequelize.where(Sequelize.fn('', Sequelize.col('from_amount')), 'LIKE', '%' + searchQuery + '%') },
    {
      '$subsidiary.name$': { [Sequelize.Op.like]: '%' + searchQuery + '%' }  
    },
  ]


  const { count, rows } = await Tax_slabModel.findAndCountAll({
    order: [
      ['from_amount', 'ASC']
    ],
    where: {
      [Op.or]: queryFilters,
       subsidiaryId, // Directly include the subsidiaryId filter here
      taxSetupId, // Similarly, directly include the taxSetupId filter
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: SubsidiaryModel,
        attributes: ["name"],
        as: "Subsidiary",
      },
      {
        model: TaxSetupModel,
        attributes: ["isActive"],
        as: "TaxSetup",
      },
    ]
  });


  return paginationFacts(count, limit, options.pageNumber, rows);

};



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const gettax_slabById = async (id) => {
  return Tax_slabModel.findByPk(id);
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

    let result = { "message": 'From Amount must be less than To Amount', "status": "error" }
    return result;
  }

  const overlappingSlab = await Tax_slabModel.findOne({
    where: {
      id: { [Op.ne]: Id },
      subsidiaryId: updateBody.subsidiaryId,  // Add subsidiaryId condition
      taxSetupId: updateBody.taxSetupId,
      [Op.or]: [
        { from_amount: { [Op.between]: [from_amount, to_amount] } },
        { to_amount: { [Op.between]: [from_amount, to_amount] } },
        { from_amount: { [Op.lte]: from_amount }, to_amount: { [Op.gte]: to_amount } }
      ]
    }
  });


  if (overlappingSlab) {

    let result = { "message": 'Record already exist.', "status": "error" }
    return result;
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
  deletetax_slabById,
  get_all_taxYear_setup
};

const httpStatus = require("http-status");
const axios = require("axios")
const  ContactModel  = require("../../../models/index");
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
 * @param {Object} ContactBody
 * @returns {Promise<Contact>}
 */
const createContact = async (req, ContactBody) => {
    console.log("Contact Body", ContactBody)
  // ContactBody.slug = ContactBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  ContactBody.createdBy = req.user.id;
  console.log(ContactBody,"body");
  const addedContactObj = await ContactModel.ContactInformationModel.create(ContactBody);
  //authSMSSend(addedContactObj.dataValues);  // Quick send message at the time of donation
  return addedContactObj;
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
const queryContacts = async (filter, options, searchQuery) => {
  
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { relation_name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('relation_name')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await ContactModel.ContactInformationModel.findAndCountAll({
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
const getContactById = async (id) => {
  console.log("getcontactById", id)
  return ContactModel.ContactInformationModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateContactById = async (Id, updateBody, updatedBy) => {

  console.log("zzz",Id);
  const Item = await getContactById(Id);
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


const SP_getAllContactList = async (filter, options, searchQuery) => {
  try {
    console.log("SP_getAllContactList section")
    const results = await sequelize.query('CALL usp_GetAllContactList()');

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
function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['relation'].toLowerCase().includes(string.toLowerCase()) || o['relation_name'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}


/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
  const deleteContactById = async (Id) => {

  const Item = await getContactById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createContact,
  queryContacts,
  getContactById,
  updateContactById,
  deleteContactById,
  SP_getAllContactList
};

const httpStatus = require("http-status");
const { ItemModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a Item
 * @param {Object} ItemBody
 * @returns {Promise<Item>}
 */
const createItem = async (req, ItemBody) => {
  ItemBody.slug = ItemBody.name.replace(/ /g, "-").toLowerCase();
  ItemBody.createdBy = req.user.id;
  const itemAdded = await ItemModel.create(ItemBody);

  return itemAdded;
};

/**
 * Query for Items
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryItems = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const Items = await ItemModel.findAll({
    offset: offset,
    limit: limit,
  });
  return Items;
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ItemModel>}
 */
const getItemById = async (id) => {
  return ItemModel.findByPk(id);
};

/**
 * Update Item by id
 * @param {ObjectId} ItemId
 * @param {Object} updateBody
 * @returns {Promise<ItemModel>}
 */
const updateItemById = async (ItemId, updateBody, updatedBy) => {
  const Item = await getItemById(ItemId);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return Item;
};

/**
 * Delete Item by id
 * @param {ObjectId} ItemId
 * @returns {Promise<ItemModel>}
 */
const deleteItemById = async (ItemId) => {
  const Item = await getItemById(ItemId);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
};

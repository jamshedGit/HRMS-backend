const httpStatus = require("http-status");
const { ExpenseCategoryModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a ExpenseCategory
 * @param {Object} ExpenseCategoryBody
 * @returns {Promise<ExpenseCategory>}
 */
const createExpenseCategory = async (req, ExpenseCategoryBody) => {
  ExpenseCategoryBody.slug = ExpenseCategoryBody.name.replace(/ /g, "-").toLowerCase();
  ExpenseCategoryBody.createdBy = req.user.id;
  const ExpenseCategoryAdded = await ExpenseCategoryModel.create(ExpenseCategoryBody);

  return ExpenseCategoryAdded;
};

/**
 * Query for ExpenseCategories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExpenseCategories = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const ExpenseCategories = await ExpenseCategoryModel.findAll({
    offset: offset,
    limit: limit,
  });
  return ExpenseCategories;
};

/**
 * Get ExpenseCategory by id
 * @param {ObjectId} id
 * @returns {Promise<ExpenseCategoryModel>}
 */
const getExpenseCategoryById = async (id) => {
  return ExpenseCategoryModel.findByPk(id);
};

/**
 * Update ExpenseCategory by id
 * @param {ObjectId} ExpenseCategoryId
 * @param {Object} updateBody
 * @returns {Promise<ExpenseCategoryModel>}
 */
const updateExpenseCategoryById = async (ExpenseCategoryId, updateBody, updatedBy) => {
  const ExpenseCategory = await getExpenseCategoryById(ExpenseCategoryId);
  if (!ExpenseCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Expense Category not found");
  }
  updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(ExpenseCategory, updateBody);
  await ExpenseCategory.save();
  return ExpenseCategory;
};

/**
 * Delete ExpenseCategory by id
 * @param {ObjectId} ExpenseCategoryId
 * @returns {Promise<ExpenseCategoryModel>}
 */
const deleteExpenseCategoryById = async (ExpenseCategoryId) => {
  const ExpenseCategory = await getExpenseCategoryById(ExpenseCategoryId);
  if (!ExpenseCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Expense Category not found");
  }
  await ExpenseCategory.destroy();
  return ExpenseCategory;
};

module.exports = {
  createExpenseCategory,
  queryExpenseCategories,
  getExpenseCategoryById,
  updateExpenseCategoryById,
  deleteExpenseCategoryById,
};

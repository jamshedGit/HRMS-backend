const httpStatus = require("http-status");
const axios = require("axios")
const EmployeeShiftModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts, currentSubsidiaryPermission } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')
const pick = require("../../../utils/pick");
const { LEAVE_TYPE, FORBIDDEN_CODES } = require("../../../models/operations/leave_type/enum/leave_type.enum");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} EmployeeShiftBody
 * @returns {Promise<EmployeeShift>}
 */
const createEmployeeShift = async (req) => {
  try {
    req.body.createdBy = req.user.id;
    const addedEmployeeShiftObj = await EmployeeShiftModel.Employee_ShiftModel.create(req.body);
    return addedEmployeeShiftObj;
  }
  catch (error) {

    if (error.parent.errno === 1062) {

      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  };
}



/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEmployeeShifts = async (req) => {

  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get search field value for filtering
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + searchQuery + '%') },
  ]
  

  const { count, rows } = await EmployeeShiftModel.Employee_ShiftModel.findAndCountAll({
    where: {
      [Op.and]: queryFilters, // Apply the query filters
      subsidiaryId: {
        [Op.in]: await currentSubsidiaryPermission(req)  // Filter banks based on subsidiaryId
      }
    
    },
    order: [
      ['createdAt', 'DESC'],
    ],

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
const getEmployeeShiftById = async (id) => {


  const a = EmployeeShiftModel.Employee_ShiftModel.findByPk(id, {


    include: [

      {

        model: EmployeeShiftModel.SubsidiaryModel,
        attributes: ["Id", ["name", "subsName"]],
        as: "subs",
      }
    ],
  });

  return a;
};


const getAttConfigData = async (filters, attributes = null, include = null) => {
  const options = {};
  if (filters) {
    options.where = filters
  }
  if (attributes) {
    options.attributes = attributes
  }
  if (include) {
    options.include = include
  }

  return await EmployeeShiftModel.Attendance_ConfigurationModel.findOne(options);
};


/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmployeeShiftById = async (body, updatedBy) => {

  let oldRecord = await getAttConfigData({ subsidiaryId: body.subsidiaryId });
  // if (oldRecord && oldRecord.Id != body.Id) {
  //   throw new ApiError(httpStatus.FORBIDDEN, `subsidiary already in use ${body.subs.subsName}. Please use another subsidiary`);
  // }
  // else {
  oldRecord = await getEmployeeShiftById(body.Id)
  //}
  body.updatedBy = updatedBy;

  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();

  const data = await getEmployeeShiftById(updatedData.Id)
  return data;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
const deleteEmployeeShiftById = async (Id) => {

  const Item = await getEmployeeShiftById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEmployeeShift,
  queryEmployeeShifts,
  getEmployeeShiftById,
  updateEmployeeShiftById,
  deleteEmployeeShiftById
};

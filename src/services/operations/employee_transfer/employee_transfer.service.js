const httpStatus = require("http-status");
const axios = require("axios")
const EmployeeTransferModel = require("../../../models/index");
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
 * @param {Object} EmployeeTransferBody
 * @returns {Promise<EmployeeTransfer>}
 */
const createEmployeeTransfer = async (req, EmployeeTransferBody) => {
  console.log("EmployeeTransfer Body", EmployeeTransferBody)
  // EmployeeTransferBody.slug = EmployeeTransferBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  EmployeeTransferBody.createdBy = req.user.id;
  console.log(EmployeeTransferBody, "body");
  const addedEmployeeTransferObj = await EmployeeTransferModel.EmployeeTransferModel.create(EmployeeTransferBody);
  //authSMSSend(addedEmployeeTransferObj.dataValues);  // Quick send message at the time of donation
  return addedEmployeeTransferObj;
};

const usp_InsertEmployeeTransferBulk = async (arr) => {
  try {

    console.log("res insert bulk", arr);
    // arr.forEach(async ele => {

    // });

    console.log("array1", arr);
    arr.forEach(async ele => {


      const transferDate = ele.transferDate.split("T")[0];
      const deleteQuery = "delete from t_employee_transfer where employeeId = " + ele.employeeId + " and DATE_FORMAT(transferDate, '%Y-%m-%d') = " + "'" + transferDate + "'";
      console.log("ele.transferDate", deleteQuery)


      const resp = await sequelize.query(deleteQuery);
      const results = await sequelize.query
        ('CALL usp_InsertEmployeeTransferBulk(:employeeId,:transferType,:transferDate,:tillTransferDate,:transferRemarks,:employeeTypeId,:employeeTypeId_To,:companyId,:companyId_To,:subsidiaryId,:subsidiaryId_To,:departmentId,:departmentId_To,:gradeId,:gradeId_To,:designationId,:designationId_To,:locationId,:locationId_To,:regionId,:regionId_To,:cityId,:cityId_To,:countryId,:countryId_To,:payrollGroupId,:payrollGroupId_To,:defaultShiftId,:defaultShiftId_To,:reportTo,:reportTo_To,:teamId,:teamId_To,:createdBy)', {
          replacements: {

            employeeId: ele.employeeId || 0,
            transferType: ele.transferType || '',
            transferDate: ele.transferDate || null,
            tillTransferDate: ele.tillTransferDate || null,
            transferRemarks: ele.transferRemarks || '',
            employeeTypeId: ele.employeeTypeId_From || 0,
            employeeTypeId_To: ele.employeeTypeId_To || 0,
            companyId: ele.companyId_From || 0,
            companyId_To: ele.companyId_To || 0,
            subsidiaryId: ele.subsidiaryId_From || 0,
            subsidiaryId_To: ele.subsidiaryId_To || 0,
            departmentId: ele.departmentId_From || 0,
            departmentId_To: ele.departmentId_To || 0,
            gradeId: ele.gradeId_From || 0,
            gradeId_To: ele.gradeId_To || 0,
            designationId: ele.designationId_From || 0,
            designationId_To: ele.designationId_To || 0,
            locationId: ele.locationId_From || 0,
            locationId_To: ele.locationId_To || 0,
            regionId: ele.regionId_From || 0,
            regionId_To: ele.regionId_To || 0,
            cityId: ele.cityId_From || 0,
            cityId_To: ele.cityId_To || 0,
            countryId: ele.countryId_From || 0,
            countryId_To: ele.countryId_To || 0,
            payrollGroupId: ele.payrollGroupId_From || 0,
            payrollGroupId_To: ele.payrollGroupId_To || 0,
            defaultShiftId: ele.defaultShiftId_From || 0,
            defaultShiftId_To: ele.defaultShiftId_To || 0,
            reportTo: ele.reportTo_From || 0,
            reportTo_To: ele.reportTo_To || 0,
            teamId: ele.teamId_From || 0,
            teamId_To: ele.teamId_To || 0,
            createdBy: ele.createdBy || 0
          },
          type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
        });

    });

    return [];
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
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
const queryEmployeeTransfers = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('skill')), 'LIKE', '%' + searchQuery + '%') },
  ]
  const { count, rows } = await EmployeeTransferModel.EmployeeTransferModel.findAndCountAll({
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

const SP_getAllEmployeeTransferInfo = async (filter, options, searchQuery, empId) => {
  try {

    const results = await sequelize.query('CALL usp_GetAllEmployeeTransferDetails()', {
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
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


const SP_getAllEmployeeTransferInfoByEmpId = async (employeeId) => {
  try {
    console.log("EmployeeTransfer empID", employeeId);
    const results = await sequelize.query('CALL usp_GetAllEmployeeTransferHistoryByEmpId(:p_employeeId)', {
      replacements: { p_employeeId: employeeId},
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
    return o['EmployeeTransferCode'].toLowerCase().includes(string.toLowerCase()) || o['EmployeeTransferName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getEmployeeTransferById = async (id) => {
  console.log("employee_salary_service2", id)
  return EmployeeTransferModel.EmployeeTransferModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmployeeTransferById = async (Id, updateBody, updatedBy) => {

  console.log("expat pdate", Id, updateBody, updatedBy);
  const Item = await getEmployeeTransferById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }
  //console.log("Update Receipt Id" , item);
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
const deleteEmployeeTransferById = async (Id) => {
  console.log("delete tran", Id);
  const Item = await getEmployeeTransferById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEmployeeTransfer,
  queryEmployeeTransfers,
  getEmployeeTransferById,
  updateEmployeeTransferById,
  deleteEmployeeTransferById,
  SP_getAllEmployeeTransferInfo,
  SP_getAllEmployeeTransferInfoByEmpId,
  usp_InsertEmployeeTransferBulk
};

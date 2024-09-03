const httpStatus = require("http-status");
const axios = require("axios")
const EmployeeSalaryEarningModel = require("../../models/index");
const ApiError = require("../../utils/ApiError");
const sequelize = require("../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} EmployeeSalaryBody
 * @returns {Promise<EmployeeSalary>}
 */
const createEmployeeSalary = async (req, EmployeeSalaryBody) => {
  console.log("EmployeeSalary Body", EmployeeSalaryBody)
  // EmployeeSalaryBody.slug = EmployeeSalaryBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  EmployeeSalaryBody.createdBy = req.user.id;
  console.log(EmployeeSalaryBody, "body");
  const addedEmployeeSalaryObj = await EmployeeSalaryEarningModel.EmployeeSalaryEarningModel.create(EmployeeSalaryBody);
  //authSMSSend(addedEmployeeSalaryObj.dataValues);  // Quick send message at the time of donation
  return addedEmployeeSalaryObj;
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
const queryEmployeeSalarys = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('skill')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await EmployeeSalaryEarningModel.EmployeeSalaryEarningModel.findAndCountAll({
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


const SP_getAllEmployeeSalaryInfoForDDL = async (employeeId) => {
  try {
    const results = await sequelize.query('CALL usp_GetAllActiveEmployeesSalaryDDL(:employeeId)', {
      replacements: { employeeId: employeeId || null },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
   console.log("ddl salary", employeeId)
    return results
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const SP_getAllEmployeeSalaryInfo = async (filter, options, searchQuery, empId, transactionType) => {
  try {
    console.log("transactionType", transactionType)
    const results = await sequelize.query('CALL usp_emp_salary_earningOrdeduction_details(:id,:transactionType)', {
      replacements: { id: empId || 'null', transactionType: transactionType },
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


const usp_GetAllSalary_Earning_DeductionByEmpId = async (empId, basicSalary) => {
  try {
    console.log("EmployeeSalary empID", empId, basicSalary);
    const results = await sequelize.query('CALL usp_GetAllSalary_Earning_DeductionByEmpId(:id,:basicSalary)', {
      replacements: { id: empId || 'null', basicSalary: basicSalary || 0 },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
    console.log("gggg", results);
    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const usp_Update_Salary_Earning_Deduction_Bulk = async (arr, employeeId) => {
  try {
    console.log("world", arr)

    const resp = await sequelize.query(' delete from t_employee_salary_earning_deduction where employeeId =' + employeeId);

    console.log("resd delete", resp);
    arr.forEach(async element => {
      const results = await sequelize.query('CALL usp_updateEmpSalary_Earning_Deduction(:pkId,:factorVal,:amount,:empId,:earning_deduction_id,:transactionType,:calculation_type,:isPartOfGrossSalary)', {
        replacements: {
          pkId: element.Id || 'null', 
          factorVal: element.factorValue || 0, 
          amount: element.amount || 0,
          empId: employeeId,
          isPartOfGrossSalary: element.isPartOfGrossSalary,
          earning_deduction_id: element.earning_deduction_id,
          transactionType: element.transactionType,
          calculation_type: element.calculation_type
        },
        type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
      });

    });


    return [];
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['EmployeeSalaryCode'].toLowerCase().includes(string.toLowerCase()) || o['EmployeeSalaryName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getEmployeeSalaryById = async (id) => {
  console.log("employee_salary_service3", id)
  return EmployeeSalaryEarningModel.EmployeeSalaryEarningModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmployeeSalaryById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getEmployeeSalaryById(Id);
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
const deleteEmployeeSalaryById = async (Id) => {
  console.log("delete tran", Id);
  const Item = await getEmployeeSalaryById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEmployeeSalary,
  queryEmployeeSalarys,
  getEmployeeSalaryById,
  updateEmployeeSalaryById,
  deleteEmployeeSalaryById,
  SP_getAllEmployeeSalaryInfo,
  usp_GetAllSalary_Earning_DeductionByEmpId,
  usp_Update_Salary_Earning_Deduction_Bulk,
  SP_getAllEmployeeSalaryInfoForDDL
};

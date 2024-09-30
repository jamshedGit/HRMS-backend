const httpStatus = require("http-status");
const axios = require("axios")
const EmployeeSalaryRevisionModel = require("../../../models/index");
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
 * @param {Object} EmployeeSalaryRevisionBody
 * @returns {Promise<EmployeeSalaryRevision>}
 */
const createEmployeeSalaryRevision = async (req, EmployeeSalaryRevisionBody) => {
  console.log("EmployeeSalaryRevision Body", EmployeeSalaryRevisionBody)
  // EmployeeSalaryRevisionBody.slug = EmployeeSalaryRevisionBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  EmployeeSalaryRevisionBody.createdBy = req.user.id;
  console.log(EmployeeSalaryRevisionBody, "body");
  const addedEmployeeSalaryRevisionObj = await EmployeeSalaryRevisionModel.EmployeeSalaryRevisionModel.create(EmployeeSalaryRevisionBody);
  //authSMSSend(addedEmployeeSalaryRevisionObj.dataValues);  // Quick send message at the time of donation
  return addedEmployeeSalaryRevisionObj;
};


const usp_InsertUpdateSalaryRevisionDetails = async (obj, arrayList) => {
  try {
    console.log("tss", obj,obj.reviewDate.split('T')[0])

     const resp = await sequelize.query(' delete from t_employee_salary_revision where employeeId =' + obj.employeeId  + ' AND MONTH(reviewDate) = MONTH("'+obj.reviewDate+'") AND  YEAR(reviewDate) = YEAR("'+obj.reviewDate+'")');

    const results = await sequelize.query('CALL usp_InsertUpdateSalaryRevisionDetail(:employeeId_temp,:p_reviewDate,:old_grossSalary,:new_grossSalary,:old_basicSalary,:new_basicSalary,:old_payrollGroupId,:new_payrollGroupId,:old_designationId,:new_designationId,:old_employeeTypeId,:new_employeeTypeId,:old_gradeId,:new_gradeId,:review_reason,:createdBy,:updatedBy,@p_newId)', {
      replacements: {
        employeeId_temp: obj.employeeId || 0,
        p_reviewDate: obj.reviewDate || 0,
        old_grossSalary: obj.old_grossSalary || 0,
        new_grossSalary: obj.new_grossSalary || 0,
        old_basicSalary: obj.old_basicSalary || 0,
        new_basicSalary: obj.new_basicSalary || 0,
        old_payrollGroupId: obj.old_payrollGroupId || 0,
        new_payrollGroupId: obj.new_payrollGroupId || 0,
        old_designationId: obj.old_designationId || 0,
        new_designationId: obj.new_designationId || 0,
        old_employeeTypeId: obj.old_employeeTypeId || 0,
        new_employeeTypeId: obj.new_employeeTypeId || 0,
        old_gradeId: obj.old_gradeId || 0,
        new_gradeId: obj.new_gradeId || 0,
        review_reason: obj.review_reason || '',

        createdBy: obj.createdBy || 0,
        updatedBy: obj.updatedBy || 0,


      },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    console.log("results", results)
    if (results[0].message == 0) // for Record already exists for given month
    {
      console.log("start insert");
      // Retrieve the output parameter
      const [results1] = await sequelize.query('SELECT @p_newId AS newId', {
        type: Sequelize.QueryTypes.SELECT
      });

      const newId = results1.newId;

      const respRev = await sequelize.query(' delete from t_salary_revision_earning_deduction where employeeId =' + obj.employeeId + ' AND MONTH(createdAt) = MONTH("'+obj.reviewDate+'") AND  YEAR(createdAt) = YEAR("'+obj.reviewDate+'")');
      const respSal = await sequelize.query(' delete from t_employee_salary_earning_deduction where employeeId =' + obj.employeeId )
 
      arrayList.forEach(async ele => {
        console.log("new emp1", ele.old_transactionType)
        const results = await sequelize.query('CALL usp_Insert_salary_revision_earning_deduction(:salary_revision_Id,:employeeId,:old_transactionType,:old_calculation_type,:old_factorValue,:old_earning_deductionId,:new_earning_deductionId,:new_calculation_type,:new_factorValue,:new_amount,:old_amount,:new_transactionType,:createdBy,:updatedBy,:isPartOfGrossSalary,:createdAt,:updatedAt)', {
          replacements: {
            salary_revision_Id: newId || 0,
            employeeId: obj.employeeId || 0,

            old_transactionType: ele.old_transactionType || '',
            old_calculation_type: ele.old_calculation_type || '',
            old_earning_deductionId: ele.old_earning_deductionId || 0,
            old_factorValue: ele.old_factorValue || 0,
            old_amount: ele.old_amount || 0,

            new_transactionType: ele.new_transactionType || '',
            new_calculation_type: ele.new_calculation_type || '',
            new_earning_deductionId: ele.new_earning_deductionId || 0,
            new_factorValue: ele.new_factorValue || 0,
            new_amount: ele.new_amount || 0,
            isPartOfGrossSalary: ele.new_IsPartOfGrossSalary,
            createdBy: ele.createdBy || 0,
            updatedBy: ele.updatedBy || 0,
            createdAt: obj.reviewDate || null,
            updatedAt : obj.reviewDate || null
          },
          type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
        });

      });
    }

    else if(results[0].message == 404)
    {
        return results;
    }

    return results;
  } catch (error) {
    console.log("error 123");
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
const queryEmployeeSalaryRevisions = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('skill')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await EmployeeSalaryRevisionModel.EmployeeSalaryRevisionModel.findAndCountAll({
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



const SP_getAllEmployeeSalaryRevisionInfo = async (filter, options, searchQuery, empId, transactionType) => {
  try {
    console.log("transactionType", transactionType)
    const results = await sequelize.query('CALL usp_GetAllActiveEmployeeSalaries(:id,:transactionType)', {
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


const SP_getAllEmployeeSalaryRevisionInfoByEmpId = async (empId, transactionType) => {
  try {
    console.log("EmployeeSalaryRevision empID", empId);
    const results = await sequelize.query('CALL usp_GetAllActiveEmployeeSalaries(:id,:transactionType)', {
      replacements: { id: empId || 'null', transactionType: transactionType },
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
    return o['EmployeeSalaryRevisionCode'].toLowerCase().includes(string.toLowerCase()) || o['EmployeeSalaryRevisionName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getEmployeeSalaryRevisionById = async (id) => {
  console.log("employee_salary_service1", id)
  return EmployeeSalaryRevisionModel.EmployeeSalaryRevisionModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmployeeSalaryRevisionById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getEmployeeSalaryRevisionById(Id);
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
const deleteEmployeeSalaryRevisionById = async (Id) => {
  console.log("delete tran", Id);
  const Item = await getEmployeeSalaryRevisionById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEmployeeSalaryRevision,
  queryEmployeeSalaryRevisions,
  getEmployeeSalaryRevisionById,
  updateEmployeeSalaryRevisionById,
  deleteEmployeeSalaryRevisionById,
  SP_getAllEmployeeSalaryRevisionInfo,
  SP_getAllEmployeeSalaryRevisionInfoByEmpId,
  usp_InsertUpdateSalaryRevisionDetails
};

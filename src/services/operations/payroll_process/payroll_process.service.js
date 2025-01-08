const httpStatus = require("http-status");
const {Employee_loan_requestModel, FormModel, SubsidiaryModel, PayrollMonthModel, Payroll_ProcessModel, EmployeeProfileModel, EmployeeSalaryModel, Employee_loan_request_detailModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const {
  paginationFacts,
} = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;
const sequelize = require("../../../config/db");

// const createPayroll_Process = async (req, payroll_processBody) => {

//   try {


//     const subsidiaryExists = await Payroll_ProcessModel.findOne({
//       where: {
//         subsidiaryId: payroll_processBody.subsidiaryId,
//         payroll_groupId: payroll_processBody.payroll_groupId,
//         payroll_monthId: payroll_processBody.payroll_monthId,
//       },
//     });


//     let addedPayroll_Process;
//     let result;

//     if (subsidiaryExists) {

//       payroll_processBody.Id = subsidiaryExists.dataValues.Id;  // Ensure the ID is set correctly

//       // Removing `id` from payroll_processBody before updating (since `id` might be redundant)
//       delete payroll_processBody.Id;

//       // Assign the updated data to the existing record and save
//       payroll_processBody.createdAt = new Date();
//       payroll_processBody.completed = 0;
//       Object.assign(subsidiaryExists, payroll_processBody);
//       addedPayroll_Process = await subsidiaryExists.save();

//       //procedure


//       result = await sequelize.query(
//         'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
//         replacements: {
//           p_SubsidiaryId: payroll_processBody.subsidiaryId || 'null',
//           p_PayrollGroupId: payroll_processBody.payroll_groupId || 'null',
//           p_MonthId: payroll_processBody.payroll_monthId || 'null'
//         },
//         type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
//       });

//       // if (result) {

//         addedPayroll_Process.completedAt = new Date();
//         addedPayroll_Process.completed = 1;
//         await addedPayroll_Process.save();
//       // }

//       return await getPayroll_ProcessById(addedPayroll_Process.Id);
//     }



//     // Set createdBy field
//     payroll_processBody.createdBy = req.user.id;
//     addedPayroll_Process = await Payroll_ProcessModel.create(payroll_processBody);
//     addedPayroll_Process.createdAt = new Date();
//     await addedPayroll_Process.save();

//     result = await sequelize.query(
//       'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
//       replacements: {
//         p_SubsidiaryId: payroll_processBody.subsidiaryId || 'null',
//         p_PayrollGroupId: payroll_processBody.payroll_groupId || 'null',
//         p_MonthId: payroll_processBody.payroll_monthId || 'null'
//       },
//       type: Sequelize.QueryTypes.RAW, // Use RAW type for executing stored procedures

//     });


//     // if (result) {

//       addedPayroll_Process.completedAt = new Date();
//       addedPayroll_Process.completed = 1;
//       await addedPayroll_Process.save();
//     // }

//     return await getPayroll_ProcessById(addedPayroll_Process.Id);
//     // return "Done"

//   } catch (error) {

//     throw error; // Rethrow or handle the error as needed
//   }
// };


const createPayroll_Process = async (req, payroll_processBody) => {

  try {


    const subsidiaryExists = await Payroll_ProcessModel.findOne({
      where: {
        subsidiaryId: payroll_processBody?.subsidiaryId,
        payroll_groupId: payroll_processBody?.payroll_groupId,
        payroll_monthId: payroll_processBody?.payroll_monthId,
      },
    });


    let addedPayroll_Process;
    let result;

    if (subsidiaryExists) {

      payroll_processBody.Id = subsidiaryExists.dataValues.Id;  // Ensure the ID is set correctly

      // Removing `id` from payroll_processBody before updating (since `id` might be redundant)
      delete payroll_processBody.Id;

      // Assign the updated data to the existing record and save
      payroll_processBody.createdAt = new Date();
      payroll_processBody.completed = 0;
      Object.assign(subsidiaryExists, payroll_processBody);
      addedPayroll_Process = await subsidiaryExists.save();
    } else {
      payroll_processBody.createdBy = req.user.id;
      addedPayroll_Process = await Payroll_ProcessModel.create(payroll_processBody);
      addedPayroll_Process.createdAt = new Date();
      await addedPayroll_Process.save();
    }


    //procedure


    result = await sequelize.query(
      'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
      replacements: {
        p_SubsidiaryId: payroll_processBody?.subsidiaryId || null,
        p_PayrollGroupId: payroll_processBody?.payroll_groupId || null,
        p_MonthId: payroll_processBody?.payroll_monthId || null
      },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
console.log("result111",result)
    if (result?.length >0) {
   
    addedPayroll_Process.completedAt = new Date();
    addedPayroll_Process.completed = 1;
    await addedPayroll_Process.save();
    }
    return result[0]

    // return await getPayroll_ProcessById(addedPayroll_Process.Id);




    // Set createdBy field


    // result = await sequelize.query(
    //   'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
    //   replacements: {
    //     p_SubsidiaryId: payroll_processBody.subsidiaryId || 'null',
    //     p_PayrollGroupId: payroll_processBody.payroll_groupId || 'null',
    //     p_MonthId: payroll_processBody.payroll_monthId || 'null'
    //   },
    //   type: Sequelize.QueryTypes.RAW, // Use RAW type for executing stored procedures

    // });


    // // if (result) {

    // addedPayroll_Process.completedAt = new Date();
    // addedPayroll_Process.completed = 1;
    // await addedPayroll_Process.save();
    // // }

    // return await getPayroll_ProcessById(addedPayroll_Process.Id);
    // return "Done"

  } catch (error) {

    throw error; // Rethrow or handle the error as needed
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
const queryPayroll_Process = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    {
      min_year: Sequelize.where(
        Sequelize.fn("", Sequelize.col("t_payroll_process.subsidiaryId")),
        "LIKE",
        "%" + searchQuery + "%"
      ),
    },
  ];

  const { count, rows } = await Payroll_ProcessModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    order: [
      [Sequelize.col("Subsidiary.name"), "ASC"],   // Order by Subsidiary name

    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
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
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "PayrollGroup",
      },
      {
        model: PayrollMonthModel,
        attributes: ["month", "year"],
        as: "PayrollMonth",
      },
    ],
  });

  return paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getPayroll_ProcessById = async (id) => {
  return Payroll_ProcessModel.findOne({
    where: { Id: id },
    include: [
      {
        model: SubsidiaryModel,
        attributes: ["name"],
        as: "Subsidiary",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "PayrollGroup",
      },
      {
        model: PayrollMonthModel,
        attributes: ["month", "year"],
        as: "PayrollMonth",
      },
    ],
  });


};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */




const updatePayroll_ProcessById = async (
  Id,
  updateBody,
  updatedBy
) => {

  const Item = await getPayroll_ProcessById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  const subsidiaryExists = await Payroll_ProcessModel.findOne({
    where: {
      subsidiaryId: updateBody.subsidiaryId,
      payroll_groupId: updateBody.payroll_groupId,
      Id: { [Op.ne]: Id }
    },
  });

  if (subsidiaryExists) {
    return {
      message: "Subsidiary & payroll group already exist",
      status: "error",
    };
  }



  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return Item;

};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */

const deletePayroll_ProcessById = async (Id) => {
  const Item = await getPayroll_ProcessById(Id, {});

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};

const payroll_group_detail = async (subsidiaryId, payroll_groupId,payroll_monthId) => {
  // Step 1: Get employees based on the provided subsidiaryId and payroll_groupId
  const employees = await EmployeeProfileModel.findAndCountAll({
    where: {
      ...(subsidiaryId && { subsidiaryId: subsidiaryId }),
      ...(payroll_groupId && { payrollGroupId: payroll_groupId }),
    },
  });


  // Check if employees are found
  if (employees?.count === 0) {
    data = {
      total_employees: 0,
      slary_setup_not_created: 0,
      loan_to_be_processed: 0

    }
    return data
  }

  // Step 2: Find all employees whose salary setup has not been created
  const employeesWithoutSalarySetup = await EmployeeSalaryModel.findAll({
    where: {
      employeeId: {
        [Op.in]: employees.rows.map((emp) => emp.Id), // Assuming `id` is the employee's unique identifier
      },
    },
  });

  // Step 3: Get the count of employees whose salary setup is not created
  const employeesWithNoSalarySetupCount = employees.rows.filter((emp) => {
    // Check if this employee is NOT in the EmployeeSalaryModel

    return !employeesWithoutSalarySetup.some((salary) => salary.employeeId === emp.Id);
  }).length;



  const employeesApprovedLoanRequest = await Employee_loan_requestModel.findAll({
    where: {
      employeeId: {
        [Op.in]: employees.rows.map((emp) => emp.Id), // Assuming `id` is the employee's unique identifier
      },
      approved_status:1
    },
  });

  const currentPayrollMonth = await PayrollMonthModel.findOne({
    where: {
     
      
        Id:payroll_monthId
      
    },
  });
  
  const employeesLoanToBeProcessed = await Employee_loan_request_detailModel.findAll({
    where: {
      // employeeId: {
      //   [Op.in]: employees.rows.map((emp) => emp.Id), // Assuming `id` is the employee's unique identifier
      // },
      emp_loan_reqId: {
        [Op.in]: employeesApprovedLoanRequest?.map((req) => req.Id), // Ensure 'Id' is the correct column name in your model
      },
      payroll_month_date: {
        [Op.gte]: currentPayrollMonth?.startDate,
        [Op.lte]: currentPayrollMonth?.endDate
      }
    },
  });



  data = {
    total_employees: employees?.rows?.length,
    slary_setup_not_created: employeesWithNoSalarySetupCount,
    loan_to_be_processed:  employeesLoanToBeProcessed?.length || 0
  }

  return data

};

const checkPayroll_EmployeesByIds = async (data) => {
  const { SubsidiaryId, PayrollGroupId, MonthId } = data;
  let results;

  if (!data.revert) {
    results = await sequelize.query(
      'SELECT * FROM t_PayrollEmployees WHERE SubsidiaryId = :SubsidiaryId AND PayrollGroupId = :PayrollGroupId AND MonthId = :MonthId',
      {
        replacements: { SubsidiaryId, PayrollGroupId, MonthId },
        type: sequelize.QueryTypes.SELECT
      }
    );

  }

  else if (data.revert && data.SubsidiaryId && data.PayrollGroupId && data.MonthId) {
    //SP_PayrollProcess
    let a = await sequelize.query(
      'CALL SP_PayrollProcess_RevertBack(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)',
      {
        replacements: {
          p_SubsidiaryId: data?.SubsidiaryId,
          p_PayrollGroupId: data?.PayrollGroupId,
          p_MonthId: data?.MonthId
        },
        type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
      }
    );


    const Item = await Payroll_ProcessModel.findOne({
      where: {
        subsidiaryId: data?.SubsidiaryId,
        payroll_groupId: data?.PayrollGroupId,
        payroll_monthId: data?.MonthId
      },
    })
    Item.completed = 2
    await Item.save();
    // return Item;




  }

  return results?.length > 0 ? results : null;




};


module.exports = {
  createPayroll_Process,
  getPayroll_ProcessById,
  updatePayroll_ProcessById,
  deletePayroll_ProcessById,
  queryPayroll_Process,
  payroll_group_detail,
  checkPayroll_EmployeesByIds,

};

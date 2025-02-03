const httpStatus = require("http-status");
const { Employee_loan_requestModel, FormModel, SubsidiaryModel, PayrollMonthModel, Payroll_ProcessModel, EmployeeProfileModel, EmployeeSalaryModel, Employee_loan_request_detailModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const {
  paginationFacts,
} = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;
const sequelize = require("../../../config/db");


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

      payroll_processBody.createdBy = req.user.Id;
      addedPayroll_Process = await Payroll_ProcessModel.create(payroll_processBody);
      addedPayroll_Process.createdAt = new Date();
      await addedPayroll_Process.save();
    }


    //procedure

    const allPayrollGroup = await FormModel.findAll({
      where: { isActive: true, parentFormID: 127,companyId:req.user.companyId },
      attributes: ['formName', 'Id', 'formCode']
    });



    //127
    //FormModel

    let final_result = {
      TaxCalculated: 0,
      TaxNotCalculated: 0,
      LoanProcess: 0,
      EmployeewithZeroSalary: 0,
      EmployeewithNegativeSalary: 0,
    }
    //if condition
    if (payroll_processBody.payroll_groupId) {

      result = await sequelize.query(
        'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
        replacements: {
          p_SubsidiaryId: payroll_processBody?.subsidiaryId || null,
          p_PayrollGroupId: payroll_processBody?.payroll_groupId || null,
          p_MonthId: payroll_processBody?.payroll_monthId || null
        },
        type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
      });

      if (result?.length > 0) {

        addedPayroll_Process.completedAt = new Date();
        addedPayroll_Process.completed = 1;
        await addedPayroll_Process.save();
      }

      return result[0]




    }

    else {
      for (const payrollGroup of allPayrollGroup) {
      
        if (payrollGroup?.Id) {
          try {
            result = await sequelize.query(
              'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
              replacements: {
                p_SubsidiaryId: payroll_processBody?.subsidiaryId || null,
                p_PayrollGroupId: payrollGroup?.Id,
                p_MonthId: payroll_processBody?.payroll_monthId || null
              },
              type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
            });
          
            final_result.TaxCalculated += result[0].TaxCalculated;
            final_result.TaxNotCalculated += result[0].TaxNotCalculated;
            final_result.LoanProcess += result[0].LoanProcess;
            final_result.EmployeewithZeroSalary += result[0].EmployeewithZeroSalary;
            final_result.EmployeewithNegativeSalary += result[0].EmployeewithNegativeSalary;

          } catch (error) {

          }
        }
      }

      return final_result

    }



  } catch (error) {

    throw error; // Rethrow or handle the error as needed
  }
};

// const createPayroll_Process = async (req, payroll_processBody) => {

//   try {


//     const subsidiaryExists = await Payroll_ProcessModel.findOne({
//       where: {
//         subsidiaryId: payroll_processBody?.subsidiaryId,
//         payroll_groupId: payroll_processBody?.payroll_groupId,
//         payroll_monthId: payroll_processBody?.payroll_monthId,
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
//       // addedPayroll_Process = await subsidiaryExists.save();
//     } else {
//       payroll_processBody.createdBy = req.user.id;
//       addedPayroll_Process = await Payroll_ProcessModel.create(payroll_processBody);
//       addedPayroll_Process.createdAt = new Date();
//       // await addedPayroll_Process.save();
//     }


//     //procedure

//     const allPayrollGroup = await FormModel.findOne({
//       where: {
//         Id: 127,
//       },
//     });




// //127
// //FormModel
//     // for (const emp of employeeData) {
//     //   if (emp?.t_subsidiary?.t_company) {
//     //     try {
//     //       await sequelize.query('CALL SP_SmartlyProceedAttendance(:p_CompanyId ,:p_SubsidiaryId ,:p_M_EmpId ,:p_FromDate ,:p_ToDate,:p_isSpecial)', {
//     //         replacements: {
//     //           p_CompanyId: emp.t_subsidiary.t_company.Id,
//     //           p_SubsidiaryId: emp.t_subsidiary.Id,
//     //           p_M_EmpId: emp.Id,
//     //           p_FromDate: formatDates(filter.from, 'yyyy-MM-dd'),
//     //           p_ToDate: formatDates(filter.to, 'yyyy-MM-dd'),
//     //           p_isSpecial: 0,
//     //         },
//     //         type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
//     //       });
//     //     } catch (error) {
//     //       console.log(`'::init::${emp.Id}::'`, error);
//     //     }
//     //   }
//     // }



//     result = await sequelize.query(
//       'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
//       replacements: {
//         p_SubsidiaryId: payroll_processBody?.subsidiaryId || null,
//         p_PayrollGroupId: payroll_processBody?.payroll_groupId || null,
//         p_MonthId: payroll_processBody?.payroll_monthId || null
//       },
//       type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
//     });

//     if (result?.length >0) {

//     addedPayroll_Process.completedAt = new Date();
//     addedPayroll_Process.completed = 1;
//     // await addedPayroll_Process.save();
//     }
//     return result[0]

//     // return await getPayroll_ProcessById(addedPayroll_Process.Id);




//     // Set createdBy field


//     // result = await sequelize.query(
//     //   'CALL SP_PayrollProcess(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)', {
//     //   replacements: {
//     //     p_SubsidiaryId: payroll_processBody.subsidiaryId || 'null',
//     //     p_PayrollGroupId: payroll_processBody.payroll_groupId || 'null',
//     //     p_MonthId: payroll_processBody.payroll_monthId || 'null'
//     //   },
//     //   type: Sequelize.QueryTypes.RAW, // Use RAW type for executing stored procedures

//     // });


//     // // if (result) {

//     // addedPayroll_Process.completedAt = new Date();
//     // addedPayroll_Process.completed = 1;
//     // await addedPayroll_Process.save();
//     // // }

//     // return await getPayroll_ProcessById(addedPayroll_Process.Id);
//     // return "Done"

//   } catch (error) {

//     throw error; // Rethrow or handle the error as needed
//   }
// };

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

const payroll_group_detail = async (subsidiaryId, payroll_groupId, payroll_monthId) => {
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
      approved_status: 1
    },
  });

  const currentPayrollMonth = await PayrollMonthModel.findOne({
    where: {


      Id: payroll_monthId

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
    loan_to_be_processed: employeesLoanToBeProcessed?.length || 0
  }

  return data

};
//t_payrollprocess_locking

// const checkPayroll_EmployeesByIds = async (data) => {
//   const { SubsidiaryId, PayrollGroupId, MonthId } = data;

//   let results;

//   const allPayrollGroup = await FormModel.findAll({
//     where: { isActive: true, parentFormID: 127 },
//     attributes: ['formName', 'Id', 'formCode']
//   });



//   if (!data.revert && !data.finalize) {



//     results = await sequelize.query(
//       'SELECT * FROM t_PayrollEmployees WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId' +
//       (PayrollGroupId ? ' AND PayrollGroupId = :PayrollGroupId' : ''),
//       {
//         replacements: { SubsidiaryId, PayrollGroupId, MonthId },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//   }

//   else if (data.revert && data.SubsidiaryId && data.MonthId) {
//     //SP_PayrollProcess
//     if (data.PayrollGroupId) {

//       let a = await sequelize.query(
//         'CALL SP_PayrollProcess_RevertBack(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)',
//         {
//           replacements: {
//             p_SubsidiaryId: data?.SubsidiaryId,
//             p_PayrollGroupId: data?.PayrollGroupId,
//             p_MonthId: data?.MonthId
//           },
//           type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
//         }
//       );
//       const Item = await Payroll_ProcessModel.findOne({
//         where: {
//           subsidiaryId: data?.SubsidiaryId,
//           payroll_groupId: data?.PayrollGroupId,
//           payroll_monthId: data?.MonthId
//         },
//       })
//       Item.completed = 2
//       await Item.save();


//     }

//     else {
//       for (const payrollGroup of allPayrollGroup) {
//         if (payrollGroup?.Id) {
//           try {
//             let a = await sequelize.query(
//               'CALL SP_PayrollProcess_RevertBack(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)',
//               {
//                 replacements: {
//                   p_SubsidiaryId: data?.SubsidiaryId,
//                   p_PayrollGroupId: payrollGroup?.Id,
//                   p_MonthId: data?.MonthId
//                 },
//                 type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
//               }
//             );

//             const Item = await Payroll_ProcessModel.findOne({
//               where: {
//                 subsidiaryId: data?.SubsidiaryId,
//                 payroll_groupId: data?.PayrollGroupId,
//                 payroll_monthId: data?.MonthId
//               },
//             })
//             Item.completed = 2
//             await Item.save();


//           } catch (error) {

//           }
//         }

//       }
//     }



//   }

//   else if (data.finalize && data.SubsidiaryId && data.MonthId) {

//     if (data.PayrollGroupId) {
//       let finalized = await sequelize.query(
//         'SELECT * FROM t_payrollprocess_locking WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId' +
//         (PayrollGroupId ? ' AND PayrollGroupId = :PayrollGroupId' : ''),
//         {
//           replacements: { SubsidiaryId, PayrollGroupId, MonthId },
//           type: sequelize.QueryTypes.SELECT
//         }
//       );

//       if (finalized && finalized.length > 0) {
//         let record = finalized[0];

//         // Update the record using raw SQL
//         await sequelize.query(
//           'UPDATE t_payrollprocess_locking SET isFinalized = :isFinalized WHERE Id = :Id',
//           {
//             replacements: { isFinalized: 1, Id: record.Id },
//             type: sequelize.QueryTypes.UPDATE
//           }
//         );
//       }


//     }
//     else {
//       for (const payrollGroup of allPayrollGroup) {

//         let finalized = await sequelize.query(
//           'SELECT * FROM t_payrollprocess_locking WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId' +
//           (payrollGroup.Id ? ' AND PayrollGroupId = :PayrollGroupId' : ''),
//           {
//             replacements: { SubsidiaryId, PayrollGroupId: payrollGroup.Id, MonthId },
//             type: sequelize.QueryTypes.SELECT
//           }
//         );

//         if (finalized && finalized.length > 0) {
//           let record = finalized[0];

//           // Update the record using raw SQL
//           await sequelize.query(
//             'UPDATE t_payrollprocess_locking SET isFinalized = :isFinalized WHERE Id = :Id',
//             {
//               replacements: { isFinalized: 1, Id: record.Id },
//               type: sequelize.QueryTypes.UPDATE
//             }
//           );
//         }


//       }

//     }








//   }
//   return results?.length > 0 ? results : null;




// };


const checkPayroll_EmployeesByIds = async (data) => {
  const { SubsidiaryId, PayrollGroupId, MonthId, revert, finalize } = data;

  const allPayrollGroup = await FormModel.findAll({
    where: { isActive: true, parentFormID: 127 },
    attributes: ['formName', 'Id', 'formCode']
  });

  // Helper function to handle database updates and queries
  const processFinalization = async (payrollGroupId) => {
    
    let finalized = await sequelize.query(
      'SELECT * FROM t_payrollprocess_locking WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId' + 
      (payrollGroupId ? ' AND PayrollGroupId = :PayrollGroupId' : ''),
      {
        replacements: { SubsidiaryId, PayrollGroupId: payrollGroupId, MonthId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (finalized.length > 0) {
      await sequelize.query(
        'UPDATE t_payrollprocess_locking SET isFinalized = :isFinalized WHERE Id = :Id',
        {
          replacements: { isFinalized: 1, Id: finalized[0].Id },
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }
  };

  if (!revert && !finalize) {
    if(PayrollGroupId){
      return await sequelize.query(
        'SELECT * FROM t_payrollprocess_locking WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId AND isFinalized = :isFinalized'  + 
        (PayrollGroupId ? ' AND PayrollGroupId = :PayrollGroupId' : ''),
        {
          replacements: { SubsidiaryId, PayrollGroupId, MonthId ,isFinalized: 1 },
          type: sequelize.QueryTypes.SELECT
        }
      );
    }else{
      // allPayrollGroup
      let results = [];
      for (const payrollGroup of allPayrollGroup) {
        let record = await sequelize.query(
          'SELECT * FROM t_payrollprocess_locking WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId AND PayrollGroupId = :PayrollGroupId AND isFinalized = :isFinalized',
          {
            replacements: { SubsidiaryId, PayrollGroupId: payrollGroup.Id, MonthId,isFinalized: 1 },
            type: sequelize.QueryTypes.SELECT
          }
        );
        if(record.length>0){
          results.push(record);
        }
      
      }

      if(results.length !=allPayrollGroup.length){
     
        return []
      }else{
       
        return results
      }

    }
   
  } else if (revert && SubsidiaryId && MonthId) {
    if (PayrollGroupId) {
      await sequelize.query(
        'CALL SP_PayrollProcess_RevertBack(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)',
        {
        
          replacements: {
            p_SubsidiaryId: data?.SubsidiaryId,
            p_PayrollGroupId: PayrollGroupId,
            p_MonthId: data?.MonthId},
          type: Sequelize.QueryTypes.RAW
        }
      );
      // const item = await Payroll_ProcessModel.findOne({
      //   where: { subsidiaryId: SubsidiaryId, payroll_groupId: PayrollGroupId, payroll_monthId: MonthId }
      // });
      // item.completed = 2;
      // await item.save();
    } else {
      for (const payrollGroup of allPayrollGroup) {
     
        if (payrollGroup?.Id) {
          await sequelize.query(
            'CALL SP_PayrollProcess_RevertBack(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)',
            {
              replacements: {
                                  p_SubsidiaryId: data?.SubsidiaryId,
                                  p_PayrollGroupId: payrollGroup?.Id,
                                  p_MonthId: data?.MonthId},
              type: Sequelize.QueryTypes.RAW
            }
          );
          // const item = await Payroll_ProcessModel.findOne({
          //   where: { subsidiaryId: SubsidiaryId, payroll_groupId: payrollGroup.Id, payroll_monthId: MonthId }
          // });
        
          // item.completed = 2;
          // await item.save();
        }
      }
    }
  } else if (finalize && SubsidiaryId && MonthId) {

    if (PayrollGroupId) {
      await processFinalization(PayrollGroupId);
    } else {
  
      for (const payrollGroup of allPayrollGroup) {
        await processFinalization(payrollGroup.Id);
      }
    }
  }

  // return null;
};



// const checkPayroll_EmployeesByIds = async (data) => {
//   const { SubsidiaryId, PayrollGroupId, MonthId } = data;

//   let results;


//   if (!data.revert && !data.finalize) {


//     results = await sequelize.query(
//       'SELECT * FROM t_PayrollEmployees WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId' +
//       (PayrollGroupId ? ' AND PayrollGroupId = :PayrollGroupId' : ''),
//       {
//         replacements: { SubsidiaryId, PayrollGroupId, MonthId },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//   }

//   else if (data.revert && data.SubsidiaryId && data.MonthId) {
//     //SP_PayrollProcess

//     let a = await sequelize.query(
//       'CALL SP_PayrollProcess_RevertBack(:p_SubsidiaryId, :p_PayrollGroupId, :p_MonthId)',
//       {
//         replacements: {
//           p_SubsidiaryId: data?.SubsidiaryId,
//           p_PayrollGroupId: data?.PayrollGroupId,
//           p_MonthId: data?.MonthId
//         },
//         type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
//       }
//     );





//     const Item = await Payroll_ProcessModel.findOne({
//       where: {
//         subsidiaryId: data?.SubsidiaryId,
//         payroll_groupId: data?.PayrollGroupId,
//         payroll_monthId: data?.MonthId
//       },
//     })
//     Item.completed = 2
//     await Item.save();
//     // return Item;




//   }

//   else if (data.finalize && data.SubsidiaryId && data.MonthId) {


//     let finalized = await sequelize.query(
//       'SELECT * FROM t_payrollprocess_locking WHERE SubsidiaryId = :SubsidiaryId AND MonthId = :MonthId' +
//       (PayrollGroupId ? ' AND PayrollGroupId = :PayrollGroupId' : ''),
//       {
//         replacements: { SubsidiaryId, PayrollGroupId, MonthId },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     if (finalized && finalized.length > 0) {
//       let record = finalized[0];

//       // Update the record using raw SQL
//       await sequelize.query(
//         'UPDATE t_payrollprocess_locking SET isFinalized = :isFinalized WHERE Id = :Id',
//         {
//           replacements: { isFinalized: 1, Id: record.Id },
//           type: sequelize.QueryTypes.UPDATE
//         }
//       );
//     }







//   }
//   return results?.length > 0 ? results : null;




// };


module.exports = {
  createPayroll_Process,
  getPayroll_ProcessById,
  updatePayroll_ProcessById,
  deletePayroll_ProcessById,
  queryPayroll_Process,
  payroll_group_detail,
  checkPayroll_EmployeesByIds,

};

const { RoleModel, ResourceModel, CountryModel, CityModel, StatusTypeModel, BankModel, DeptModel, FormModel, EmployeeProfileModel, BranchModel, EmployeeSalaryRevisionModel, LeaveTypeModel, FiscalSetupModel, SubsidiaryModel, LeaveManagementConfigurationModel, LeaveTypePoliciesModel, AllocateLeavesModel, Employee_ShiftModel, LeaveTypeModelAccess, CompanyModel, User_Model } = require('../../models');
const { getDdlItems, getAlarmTimesItems, formatDates, createFiscalYearLabel, createEmployeeShiftLabel, createEmployeeNameLabel, currentSubsidiaryPermission } = require('../../utils/common');
const { DDL_FIELD_NAMES } = require('../../utils/constants');
const { getRoleById } = require('./role.service');
const Sequelize = require('sequelize');
const sequelize = require('../../config/db');
const ApiError = require('../../utils/ApiError');
const Op = Sequelize.Op;



// for all role , not delete

// const getRolesMasterData = async (roleId) => {
//   var userRole = await getRoleById(roleId);
//   userRole = userRole.slug == 'super-admin' ? true : false;

//   let whereClause;
//   if (userRole !== true) {
//     whereClause = {
//       slug: { [Op.not]: ['super-admin', 'admin'] },
//     };
//   }
//   const rolesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await RoleModel.findAll({
//     where: { isActive: true },
//     where: whereClause,
//     attributes: ['id', 'name']
//   }));
//   return rolesMasterData
// };



const getRolesMasterData = async (roleId, currentUserId) => {
  try {

    const currentUser = await User_Model.findOne({
      where: { Id: currentUserId },  // Assuming currentUserId is passed for the logged-in user
      include: [
        {
          model: RoleModel,
          as: 'role',
          attributes: ['id', 'name'],
        }],

    });

    // If user not found, throw error
    if (!currentUser) {
      throw new Error('User not found');
    }


    const rolesMasterData = await RoleModel.findAll({
      where: { isActive: true },
      attributes: ['id', 'name']
    });

    // Fetch all active users data to check their supervision hierarchy
    const allUsers = await User_Model.findAll({
      where: { isActive: true },
      attributes: ['Id', 'roleId', 'supervisedbyId']
    });


let isRoleWithoutUsers=''
    // Recursive function to get all users under a specific supervisorId (direct and indirect supervision)
    const getUsersUnderSupervision = (supervisorId) => {
      // Find all users directly supervised by the given supervisorId
      const directSupervisedUsers = allUsers.filter(user => user.supervisedbyId === supervisorId);

      // Initialize an array to store all supervised users (direct + indirect)
      let allSupervisedUsers = [...directSupervisedUsers];

      // For each directly supervised user, check if they have further subordinates (recursive step)
      directSupervisedUsers.forEach(user => {
        // Recursively find users supervised by this user
        const indirectSupervisedUsers = getUsersUnderSupervision(user.roleId);
        allSupervisedUsers = [...allSupervisedUsers, ...indirectSupervisedUsers];
      });

      // Return all users (direct + indirect)
      return allSupervisedUsers;
    };

    // Function to filter roles based on user's supervisor hierarchy (both direct and indirect supervision)
    const filteredRoles = rolesMasterData.filter(role => {
      // If the current user is Admin (roleId === 1), they can see all roles
      if (currentUser.roleId === 1) {
        return true;  // Super Admin can view all roles
      }

      // For non-admin users, check based on their direct and indirect subordinates
      const allSupervisedUsers = getUsersUnderSupervision(currentUser.roleId);  // Get all users under the current user's supervision


      // Check if the roleId of the current role matches any supervised users' roleId
      // const isRoleSupervised = allSupervisedUsers.some(user => user.roleId === role.id);

      const isRoleSupervised = allSupervisedUsers.some(user => user.roleId === role.id);

      // Check if the role has no users assigned
       isRoleWithoutUsers = !allUsers.some(user => user.roleId === role.id);

      // Return true if the role is supervised by the current user, or if it has no users assigned
      const shouldShowRole = isRoleSupervised || isRoleWithoutUsers;



      return shouldShowRole;
    });





    // return getDdlItems(DDL_FIELD_NAMES.default, filteredRoles);

    let role = getDdlItems(DDL_FIELD_NAMES.default, filteredRoles);
    let supervisedBy = [
      ...role,
      {
        label: currentUser.role.name,  // Modify the label as needed
        value: currentUser.roleId
      }
    ];
    


    supervisedBy = supervisedBy.filter((item) => {
      // Include roles that have users or are supervised by the current user
      const hasUsers = allUsers.some(user => user.roleId === item.value);  // Check if the role has users
      
      if (item.value === currentUser.roleId) {
        return true; // Always include the current user's role
      }
      
      return hasUsers || !isRoleWithoutUsers; // Include roles with users or if it's not a "role without users" situation
    });
    
    // Remove duplicates based on the 'value' property
    let uniqueSupervisedBy = supervisedBy.filter((value, index, self) =>
      index === self.findIndex((t) => t.value === value.value)
    );
    
    let data = {
      role: role,
      supervisedBy: uniqueSupervisedBy
    };

    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};


const getStatusMasterData = async (check) => {

  if (check.filter.normal) {

    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, normal: check.filter.normal },
      attributes: ['id', 'name']
    }));
    return statusMasterData

  }

  if (check.filter.ibf) {

    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, ibf: check.filter.ibf },
      attributes: ['id', 'name']
    }));
    return statusMasterData

  }

  if (check.filter.mf) {

    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, mf: check.filter.mf },
      attributes: ['id', 'name']
    }));
    return statusMasterData

  }

  if (check.filter.cf) {

    const statusMasterData = getDdlItems(DDL_FIELD_NAMES.default, await StatusTypeModel.findAll({
      where: { isActive: true, cf: check.filter.cf },
      attributes: ['id', 'name']
    }));
    return statusMasterData

  }

};

const getResourcesMasterData = async () => {
  const resourcesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await ResourceModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return resourcesMasterData
};

const getCountriesMasterData = async () => {
  const countriesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await CountryModel.findAll({
    where: { isActive: true },
    attributes: ['id', 'name']
  }));
  return countriesMasterData
};

const getBanksMasterData = async (req) => {
  const BanksMasterData = getDdlItems(DDL_FIELD_NAMES.BankName, await BankModel.findAll({
    where: { isActive: true ,subsidiaryId: { [Op.in]: await currentSubsidiaryPermission(req) }},
    attributes: ['Id', 'Name', "subsidiaryId"]
  }));
  return BanksMasterData
};



const get_Bank_Branch_MasterData = async (req) => {
  const Bank_Branch_MasterData = getDdlItems(DDL_FIELD_NAMES.BranchName, await BranchModel.findAll({
    where: { isActive: true,bankId:req.body.bankId
      },
    attributes: ['Id', 'Name']
  }));
  return Bank_Branch_MasterData
};

const getEmployeesMasterData = async (req) => {
  // const userById = await User_Model.findOne({
  //   where: { Id: Id },
  // });
  // let sub=userById.subsidiaryId

// 
//
//   EmployeesMasterData = await EmployeeProfileModel.findAll({
//     where: {
//       isActive: true, subsidiaryId: {
//         [Op.in]: await currentSubsidiaryPermission(req)  // Use the Op.in operator here
//       }
//     },
//     attributes: ['Id', 'firstName', 'middleName', 'lastName']
//   })



const whereCondition = req.user?.roleId == 1 && req.body?.companyId 
  ? { isActive: true, companyId: req.body?.companyId } 
  : { isActive: true, subsidiaryId: { [Op.in]: await currentSubsidiaryPermission(req) } };

const EmployeesMasterData = await EmployeeProfileModel.findAll({
  where: whereCondition,
  attributes: ['Id', 'firstName', 'middleName', 'lastName']
});

  return EmployeesMasterData?.map(el => {
    return {
      label: createEmployeeNameLabel(el),
      value: el.Id
    }
  }) || []
};

const getEmployeesMasterDataBySubsidiary = async (subsidiaryId) => {
  const EmployeesMasterData = subsidiaryId ? await EmployeeProfileModel.findAll({
    where: { isActive: true, subsidiaryId: subsidiaryId },
    attributes: ['Id', 'firstName', 'middleName', 'lastName']
  }) : [];

  return EmployeesMasterData?.map(el => {
    return {
      label: createEmployeeNameLabel(el),
      value: el.Id
    }
  }) || []
};


const getDeptMasterData = async (req, Id) => {
  const deptMasterData = await DeptModel.findAll({
    where: { isActive: true, companyId: req.user.companyId },
    attributes: ['deptId', 'deptName', 'subsidiaryId']
  });

  // const filteredDeptMasterData = deptMasterData
  // .filter((x) => x.subsidiaryId?.some((id) => id === String(Id))) 
  // .map((x) => ({
  //   deptId: x.deptId,
  //   deptName: x.deptName,
  //   subsidiaryId: x.subsidiaryId,

  // }));


  let filteredDeptMasterData = deptMasterData;

  if (Id) {
    filteredDeptMasterData = deptMasterData
      .filter((x) => x.subsidiaryId?.some((id) => id === String(Id)))
      .map((x) => ({
        deptId: x.deptId,
        deptName: x.deptName,
        subsidiaryId: x.subsidiaryId,
      }));
  }

  const processedDeptMasterData = getDdlItems(DDL_FIELD_NAMES.DeptName, filteredDeptMasterData);


  return processedDeptMasterData
};

const getChildMenusByParentId = async (parentMenuId) => {
  const MenuChildsData = getDdlItems(DDL_FIELD_NAMES.FormMenus, await FormModel.findAll({
    where: { isActive: true, parentDept: parentMenuId },
    attributes: ['Id', 'formName']
  }));
  return MenuChildsData
};

const getRevisionHistoryByEmpId = async (employeeId) => {
  const MenuChildsData = getDdlItems(DDL_FIELD_NAMES.SalaryRevisionKeys, await EmployeeSalaryRevisionModel.findAll({
    where: { isActive: true, employeeId: employeeId },
    attributes: ['Id', 'reviewDate']
  }));
  return MenuChildsData
};



// const getFormMenusMasterData = async (req, res) => {
//   const FormMenusMasterData = getDdlItems(DDL_FIELD_NAMES.FormMenus, await FormModel.findAll({
//     where: { isActive: true, parentFormID: req.body.Id || null,companyId:req.user.companyId, },
//     attributes: ['formName', 'Id', 'formCode']
//   }), req.body.mergeLabel);

//   // if (FormMenusMasterData.length > 0) {
//   //   FormMenusMasterData.unshift({ label: req.body.text || '--Select--', value: null, code: null, mergeLabel: "--Select--" })
//   // }
//   return FormMenusMasterData
// };


const getFormMenusMasterData = async (req, res) => {
let FormMenusMasterData;
  const FormParent = await FormModel.findOne({
    where: {Id: req.body.Id},
    attributes: ['formName', 'Id', 'formCode','isActive']
  });

  
  if(FormParent?.isActive){
    FormMenusMasterData = getDdlItems(DDL_FIELD_NAMES.FormMenus, await FormModel.findAll({
      where: { isActive: true, parentFormID: req.body.Id || null,companyId:req.user.companyId, },
      attributes: ['formName', 'Id', 'formCode']
    }), req.body.mergeLabel);
  }else{
    FormMenusMasterData = getDdlItems(DDL_FIELD_NAMES.FormMenus, await FormModel.findAll({
      where: { isActive: true, parentFormID: req.body.Id},
      attributes: ['formName', 'Id', 'formCode']
    }), req.body.mergeLabel);
  }

  return FormMenusMasterData
};

// const getFormMenusMasterData = async (req, res) => {
//   console.log("active111",req.body.Id)
//   // First, fetch the records, checking the 'isActive' flag
//   const formRecords = await FormModel.findAll({
//     where: {
//       parentFormID: req.body.Id || null
//     },
//     attributes: ['formName', 'Id', 'formCode', 'isActive', 'companyId']
//   });

  
//   let whereCondition = {
//     parentFormID: req.body.Id || null
//   };


//   const formIdsToInclude = formRecords.map(record => {
//     if (record.isActive) {
     
//       whereCondition.companyId = req.user.companyId;
//       return record.Id;
//     } else {
     
     
//       return record.Id;
//     }
//   });
// console.log("formIdsToInclude111",formIdsToInclude)
 
//   const FormMenusMasterData = getDdlItems(
//     DDL_FIELD_NAMES.FormMenus,
//     await FormModel.findAll({
//       where: {
//         ...whereCondition,
//         Id: formIdsToInclude,  // Ensure to include only relevant records
//       },
//       attributes: ['formName', 'Id', 'formCode']
//     }),
//     req.body.mergeLabel
//   );

//   return FormMenusMasterData;
// };


/**
 * 
 * Leave Type Dropdown Data
 * If employee Id is there in the request then we have to get Leave Type dropdown data according to the Leave Types that are assigned in the Leave Management Configurations
 * else we just send all Leave Types
 * 
 * @param {Number|Null} employeeId 
 * @returns 
 */
const getLeaveTypesData = async (employeeId) => {
  let LeaveTypeData = [];
  if (employeeId) {
    const employeeWithLeaveConfig = await EmployeeProfileModel.findByPk(employeeId, { attributes: ['Id', 'subsidiaryId', 'gradeId', 'employeeTypeId'] })
    if (employeeWithLeaveConfig) {
      const leaveConfigData = await LeaveManagementConfigurationModel.findOne({
        where: {
          subsidiaryId: employeeWithLeaveConfig.subsidiaryId,
        },
        attributes: ['Id'],
        include: [
          {
            model: LeaveTypePoliciesModel,
            attributes: ['leaveType']
          }
        ]
      })

      if (leaveConfigData?.t_leave_type_policies?.length) {
        LeaveTypeData = getDdlItems(DDL_FIELD_NAMES.LeaveType, await LeaveTypeModel.findAll({
          where: {
            Id: leaveConfigData?.t_leave_type_policies.map((el) => el.leaveType), subsidiaryId: {
              [Op.like]: Sequelize.fn('CONCAT', '%', `${employeeWithLeaveConfig.subsidiaryId}`, '%')
            }
          },
          attributes: ['name', 'Id', 'type']
        }));
      }

    }
  }
  else {
    LeaveTypeData = getDdlItems(DDL_FIELD_NAMES.LeaveType, await LeaveTypeModel.findAll({
      attributes: ['name', 'Id']
    }));
  }
  LeaveTypeData.unshift({ label: '--Select--', value: null })
  return LeaveTypeData
};

const getLeaveTypesDataBySubsidiary = async (subsidiaryId) => {
  let LeaveTypeData = [];
  if (subsidiaryId) {
    LeaveTypeData = getDdlItems(DDL_FIELD_NAMES.LeaveType, await LeaveTypeModel.findAll({
      // where: {subsidiaryId: subsidiaryId},
      include: [
        {
          model: LeaveTypeModelAccess,
          where: { subsidiaryId: subsidiaryId },
          required: true,
          attributes: []
        }
      ],
      attributes: ['name', 'Id', 'type']
    }));
  }
  LeaveTypeData.unshift({ label: '--Select--', value: null })
  return LeaveTypeData
};

/**
 * 
 * Leave Type Dropdown Data
 * Get Leave Type Only that are encashable in current active year by employee Id
 * 
 * @param {Number|Null} employeeId 
 * @returns 
 */
const getEncashmentLeaveTypeData = async (employeeId, yearId) => {
  let LeaveTypeData = [];
  if (employeeId && yearId) {
    const employeeWithLeaveConfig = await EmployeeProfileModel.findByPk(employeeId, { attributes: ['Id', 'subsidiaryId', 'gradeId', 'employeeTypeId', 'cycleTypeId'] })
    if (employeeWithLeaveConfig) {
      const leaveConfigData = await LeaveManagementConfigurationModel.findOne({
        where: {
          subsidiaryId: employeeWithLeaveConfig.subsidiaryId,
        },
        attributes: ['Id'],
        include: [
          {
            model: LeaveTypePoliciesModel,
            attributes: ['leaveType', 'encashableCount'],
            where: {
              encashable: true,
            }
          }
        ]
      })

      if (leaveConfigData?.t_leave_type_policies?.length) {
        // const allocatedData = await AllocateLeavesModel.findAll({
        //   where: {
        //     leaveType: leaveConfigData?.t_leave_type_policies.map((el) => el.leaveType),
        //     subsidiaryId: employeeWithLeaveConfig.subsidiaryId,
        //     cycleTypeId: employeeWithLeaveConfig.cycleTypeId,
        //     yearId: yearId,
        //     policyType: 2
        //   },
        //   attributes: ['leaveType', 'maxCount'],
        // })

        const leaveData = await LeaveTypeModel.findAll({
          where: { Id: leaveConfigData?.t_leave_type_policies?.map((el) => el.leaveType) },
          include: [{ model: LeaveTypeModelAccess, where: { subsidiaryId: employeeWithLeaveConfig.subsidiaryId }, required: true, attributes: [] }],
          attributes: ['name', 'Id']
        });

        LeaveTypeData = leaveData.map((el) => {
          return {
            label: el.name,
            value: el.Id,
            limit: leaveConfigData?.t_leave_type_policies.find(ad => ad.leaveType == el.Id)?.encashableCount || 0
          }
        })
      }

    }
  }
  LeaveTypeData.unshift({ label: '--Select--', value: null })
  return LeaveTypeData
};


// const getAllSubsidiaryData = async (req) => {
//   const subsidiaryData = getDdlItems(DDL_FIELD_NAMES.Subsidiary, await SubsidiaryModel.findAll({
//     where: { isActive: true,Id: {
//       [Op.in]: await currentSubsidiaryPermission(req)  // Use the Op.in operator here
//     } },
//     attributes: ['name', 'Id', 'currencyId','companyId']
//   }));
//   return subsidiaryData
// };



const getAllSubsidiaryData = async (req) => {
  let subsidiaryData;
  if (req.user.roleId == 1) {
    subsidiaryData = getDdlItems(DDL_FIELD_NAMES.Subsidiary, await SubsidiaryModel.findAll({
      where: { isActive: true },
      attributes: ['name', 'Id', 'currencyId', 'companyId']
    }));
  } else {
    subsidiaryData = getDdlItems(DDL_FIELD_NAMES.Subsidiary, await SubsidiaryModel.findAll({
      where: {
        isActive: true, Id: {
          [Op.in]: await currentSubsidiaryPermission(req)  // Use the Op.in operator here
        }
      },
      attributes: ['name', 'Id', 'currencyId', 'companyId']
    }));
  }

  return subsidiaryData
};
/**
 * 
 * Get All Employee Shifts data for dropdown.
 * 
 * @returns 
 */
const getAllEmployeeShift = async (req) => {
  const result = [];
  const shiftData = await Employee_ShiftModel.findAll({
    where: {
      isActive: true,
      subsidiaryId: {
        [Op.in]: await currentSubsidiaryPermission(req)  // Filter banks based on subsidiaryId
      },
    },

    attributes: ['name', 'Id', 'startTime', 'endTime', 'subsidiaryId']
  })
  if (shiftData?.length) {
    shiftData.forEach(el => {
      result.push({
        label: createEmployeeShiftLabel(el.name, el.endTime, el.startTime),
        value: el.Id,
        subsidiaryId: el.subsidiaryId
      })
    })
  }
  return result
};

const getAllFiscalYearData = async (employeeId) => {
  const result = []
  if (employeeId) {
    const employeeData = await EmployeeProfileModel.findByPk(employeeId, { attributes: ['subsidiaryId'] })
    if (employeeData?.subsidiaryId) {

      const yearData = await FiscalSetupModel.findAll({
        where: { subsidiaryId: employeeData?.subsidiaryId },
        attributes: ['startDate', 'endDate', 'Id']
      });
      if (yearData.length) {
        yearData.forEach(element => {
          if (element.startDate && element.endDate) {
            result.push({
              label: createFiscalYearLabel(element.endDate, element.startDate),
              value: element.Id,
            })
          }
        });
      }
    }

  }

  return result;
};

const getActiveFiscalYearData = async (subsidiaryId) => {
  if (subsidiaryId) {
    const data = await FiscalSetupModel.findOne({
      where: { isActive: true, subsidiaryId: subsidiaryId },
      attributes: ['startDate', 'endDate', 'Id']
    });
    if (!data) {
      return null;
    }
    return { label: createFiscalYearLabel(data.endDate, data.startDate) }
  }
  return null;
};


const getCitiesMasterData = async (countryId) => {
  const filter = { isActive: true }
  if (countryId) {

    filter.countryId = countryId

  }
  const citiesMasterData = getDdlItems(DDL_FIELD_NAMES.city, await CityModel.findAll({
    where: filter,
    attributes: ['id', 'name', 'countryId']
  }));
  return citiesMasterData
};


const GetLastInserted_ID_ByTableName = async (p_TableName, pkIdColumnName, whereClause) => {
  try {
   
    const results = await sequelize.query('CALL usp_GenerateDynamicId(:p_TableName,:p_IdColumn,:p_WhereClause)', {
      replacements: { p_TableName: p_TableName, p_IdColumn: pkIdColumnName, p_WhereClause: whereClause },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const getCompanyMasterData = async (req) => {

  if (req.user.roleId == 1) {
    const comapnyData = getDdlItems(DDL_FIELD_NAMES.Company, await CompanyModel.findAll({
      where: { isActive: true },
      attributes: ['companyLegalName', 'Id']
    }));
    return comapnyData
  }
  else {
    return []
  }

};


const getEmployeesNoNeedPermission = async (req) => {

  const EmployeesMasterData = await EmployeeProfileModel.findAll({
    where: { isActive: true ,companyId:req.user.companyId},
    attributes: ['Id', 'firstName', 'middleName', 'lastName']
  })
  return EmployeesMasterData?.map(el => {
    return {
      label: createEmployeeNameLabel(el),
      value: el.Id
    }
  }) || []
};

module.exports = {
  getRolesMasterData,
  getResourcesMasterData,
  getCountriesMasterData,
  getCitiesMasterData,
  getStatusMasterData,
  getBanksMasterData,
  getDeptMasterData,
  getFormMenusMasterData,
  getChildMenusByParentId,
  getEmployeesMasterData,
  GetLastInserted_ID_ByTableName,
  get_Bank_Branch_MasterData,
  getRevisionHistoryByEmpId,
  getLeaveTypesData,
  getAllSubsidiaryData,
  getAllFiscalYearData,
  getEncashmentLeaveTypeData,
  getAllEmployeeShift,
  getLeaveTypesDataBySubsidiary,
  getActiveFiscalYearData,
  getEmployeesMasterDataBySubsidiary,
  getCompanyMasterData, getEmployeesNoNeedPermission,

};

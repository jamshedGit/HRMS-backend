const { RoleModel, ResourceModel, CountryModel, CityModel, StatusTypeModel, BankModel, DeptModel, FormModel, EmployeeProfileModel, BranchModel, EmployeeSalaryRevisionModel, LeaveTypeModel, FiscalSetupModel, SubsidiaryModel, LeaveManagementConfigurationModel, LeaveTypePoliciesModel, AllocateLeavesModel, Employee_ShiftModel, LeaveTypeModelAccess } = require('../../models');
const { getDdlItems, getAlarmTimesItems, formatDates, createFiscalYearLabel, createEmployeeShiftLabel, createEmployeeNameLabel } = require('../../utils/common');
const { DDL_FIELD_NAMES } = require('../../utils/constants');
const { getRoleById } = require('./role.service');
const Sequelize = require('sequelize');
const sequelize = require('../../config/db');
const ApiError = require('../../utils/ApiError');
const Op = Sequelize.Op;

const getRolesMasterData = async (roleId) => {
  var userRole = await getRoleById(roleId);
  userRole = userRole.slug == 'super-admin' ? true : false;

  let whereClause;
  if (userRole !== true) {
    whereClause = {
      slug: { [Op.not]: ['super-admin', 'admin'] },
    };
  }
  const rolesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await RoleModel.findAll({
    where: { isActive: true },
    where: whereClause,
    attributes: ['id', 'name']
  }));
  return rolesMasterData
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

const getBanksMasterData = async () => {
  const BanksMasterData = getDdlItems(DDL_FIELD_NAMES.BankName, await BankModel.findAll({
    where: { isActive: true },
    attributes: ['Id', 'Name', "subsidiaryId"]
  }));
  return BanksMasterData
};



const get_Bank_Branch_MasterData = async () => {
  const Bank_Branch_MasterData = getDdlItems(DDL_FIELD_NAMES.BranchName, await BranchModel.findAll({
    where: { isActive: true },
    attributes: ['Id', 'Name']
  }));
  return Bank_Branch_MasterData
};

const getEmployeesMasterData = async () => {
  const EmployeesMasterData = await EmployeeProfileModel.findAll({
    where: { isActive: true },
    attributes: ['Id', 'firstName', 'middleName', 'lastName']
  })
  return EmployeesMasterData?.map(el => {
    return {
      label: createEmployeeNameLabel(el),
      value: el.Id
    }
  }) || []
};


const getDeptMasterData = async (Id) => {
  const deptMasterData = await DeptModel.findAll({
    where: { isActive: true },
    attributes: ['deptId', 'deptName', 'subsidiaryId']
  });

  const filteredDeptMasterData = deptMasterData
  .filter((x) => x.subsidiaryId?.some((id) => id === String(Id))) // Check if any value in subsidiaryId matches Id
  .map((x) => ({
    deptId: x.deptId,
    deptName: x.deptName,
    subsidiaryId: x.subsidiaryId,
    // Assuming mergeLabel should be a combination of deptName and subsidiaryId
    // mergeLabel: `${x.deptName} - ${x.subsidiaryId.join(', ')}`  // Create mergeLabel from deptName and subsidiaryId
  }));

// Process the filtered data if necessary
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



const getFormMenusMasterData = async (req, res) => {
  const FormMenusMasterData = getDdlItems(DDL_FIELD_NAMES.FormMenus, await FormModel.findAll({
    where: { isActive: true, parentFormID: req.body.Id || null },
    attributes: ['formName', 'Id', 'formCode']
  }), req.body.mergeLabel);

  // if (FormMenusMasterData.length > 0) {
  //   FormMenusMasterData.unshift({ label: req.body.text || '--Select--', value: null, code: null, mergeLabel: "--Select--" })
  // }
  return FormMenusMasterData
};

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


const getAllSubsidiaryData = async () => {
  const subsidiaryData = getDdlItems(DDL_FIELD_NAMES.Subsidiary, await SubsidiaryModel.findAll({
    where: { isActive: true },
    attributes: ['name', 'Id', 'currencyId']
  }));
  return subsidiaryData
};

/**
 * 
 * Get All Employee Shifts data for dropdown.
 * 
 * @returns 
 */
const getAllEmployeeShift = async () => {
  const result = [];
  const shiftData = await Employee_ShiftModel.findAll({
    where: { isActive: true },
    attributes: ['name', 'Id', 'startTime', 'endTime']
  })
  if (shiftData?.length) {
    shiftData.forEach(el => {
      result.push({
        label: createEmployeeShiftLabel(el.name, el.endTime, el.startTime),
        value: el.Id
      })
    })
  }
  return result
};

const getAllFiscalYearData = async () => {
  const result = []
  const yearData = await FiscalSetupModel.findAll({
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
  getActiveFiscalYearData
};

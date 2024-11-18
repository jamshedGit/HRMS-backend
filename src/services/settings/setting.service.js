const { RoleModel, ResourceModel, CountryModel, CityModel, StatusTypeModel, BankModel, DeptModel, FormModel, EmployeeProfileModel, BranchModel, EmployeeSalaryRevisionModel, LeaveTypeModel, FiscalSetupModel, SubsidiaryModel, LeaveManagementConfigurationModel, LeaveTypePoliciesModel } = require('../../models');
const { getDdlItems, getAlarmTimesItems, formatDates, createFiscalYearLabel } = require('../../utils/common');
const { DDL_FIELD_NAMES } = require('../../utils/constants');
const { getRoleById } = require('./role.service');
const Sequelize = require('sequelize');
const sequelize = require('../../config/db')
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
    attributes: ['Id', 'Name']
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
  const EmployeesMasterData = getDdlItems(DDL_FIELD_NAMES.EmployeesKeys, await EmployeeProfileModel.findAll({
    where: { isActive: true },
    attributes: ['Id', 'firstName']
  }));
  return EmployeesMasterData
};


const getDeptMasterData = async () => {
  const DeptMasterData = getDdlItems(DDL_FIELD_NAMES.DeptName, await DeptModel.findAll({
    where: { isActive: true },
    attributes: ['deptId', 'deptName']
  }));
  return DeptMasterData
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
    attributes: ['formName', 'Id','formCode']
  }),req.body.mergeLabel);

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
          gradeId: employeeWithLeaveConfig.gradeId,
          employeeTypeId: employeeWithLeaveConfig.employeeTypeId
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
          where: { Id: leaveConfigData?.t_leave_type_policies.map((el) => el.leaveType) },
          attributes: ['name', 'Id']
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


const getAllSubsidiaryData = async () => {
  const subsidiaryData = getDdlItems(DDL_FIELD_NAMES.Subsidiary, await SubsidiaryModel.findAll({
    where: { isActive: true },
    attributes: ['name', 'Id']
  }));
  return subsidiaryData
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







const GetLastInserted_ID_ByTableName = async (tableName, prefix) => {
  try {
    const results = await sequelize.query('CALL GetLastInsertedIdByTableName(:tableName,:prefix)', {
      replacements: { tableName: tableName, prefix: prefix },
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
  getAllFiscalYearData
};

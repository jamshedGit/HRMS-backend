const { UserModel, RoleModel, ResourceModel, CountryModel, CityModel, StatusTypeModel, BankModel, DeptModel, FormModel, EmployeeProfileModel, BranchModel, EmployeeSalaryRevisionModel } = require('../../models');
const { getDdlItems, getAlarmTimesItems } = require('../../utils/common');
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
    where: { isActive: true, parentDept: null },
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
    where: { isActive: true,employeeId : employeeId },
    attributes: ['Id', 'reviewDate']
  }));
  return MenuChildsData
};



const getFormMenusMasterData = async (req, res) => {
  console.log("mm:", req.body.Id)
  const FormMenusMasterData = getDdlItems(DDL_FIELD_NAMES.FormMenus, await FormModel.findAll({
    where: { isActive: true, parentFormID: req.body.Id || null },
    attributes: ['formName', 'Id','formCode']
  }));
  console.log("getFormMenusMasterData ",FormMenusMasterData)
  if (FormMenusMasterData.length > 0) {
    FormMenusMasterData.unshift({ label: '--Select--', value: null,code:null})
  }
  console.log("Dropdown", FormMenusMasterData);
  return FormMenusMasterData
};


const getCitiesMasterData = async (countryId) => {
  const citiesMasterData = getDdlItems(DDL_FIELD_NAMES.default, await CityModel.findAll({
    where: { isActive: true, countryId: countryId },
    attributes: ['id', 'name']
  }));
  return citiesMasterData
};







const GetLastInserted_ID_ByTableName = async (tableName,prefix) => {
  try {
    console.log("tableName",tableName,prefix);
    const results = await sequelize.query('CALL GetLastInsertedIdByTableName(:tableName,:prefix)', {
      replacements: { tableName: tableName , prefix: prefix },
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
  getRevisionHistoryByEmpId
};

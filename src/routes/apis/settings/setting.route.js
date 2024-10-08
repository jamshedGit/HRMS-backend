const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const {roleValidation, resourceValidation, accessRightValidation, settingValidation } = require('../../../validations');
const {roleController, resourceController, accessRightController, settingController } = require('../../../controllers/apis');
const { getMaxNoFromReceipt } = require('../../../validations/operations/entities/receipt.validation');
const { getMaxbookingNoForReceipt } = require('../../../controllers/apis/operations/edrs/receipt.controller');
const router = express.Router();

// Role Routes
router.route('/read-role').post(auth(), validate(roleValidation.getRole), roleController.getRole);
router.route('/read-all-roles').post(auth(), validate(roleValidation.getRoles), roleController.getRoles);
router.route('/create-role').post(auth(), validate(roleValidation.createRole), roleController.createRole);
router.route('/update-role').put(auth(), validate(roleValidation.updateRole), roleController.updateRole);
router.route('/delete-role').patch(auth(), validate(roleValidation.deleteRole), roleController.deleteRole);

// Resource Routes
router.route('/read-resource').post(auth(), validate(resourceValidation.getResource), resourceController.getResource);
router.route('/read-all-resources').post(auth(), validate(resourceValidation.getResources), resourceController.getResources);
router.route('/create-resource').post(auth(), validate(resourceValidation.createResource), resourceController.createResource);
router.route('/update-resource').put(auth(), validate(resourceValidation.updateResource), resourceController.updateResource);
router.route('/delete-resource').patch(auth(), validate(resourceValidation.deleteResource), resourceController.deleteResource);


// accessRight Routes
router.route('/read-all-accessrights').post(auth(), validate(accessRightValidation.getAccessRights), accessRightController.getAccessRights);
router.route('/update-accessright').put(auth(), validate(accessRightValidation.updateAccessRight), accessRightController.updateAccessRight);
router.route('/delete-accessright').patch(auth(), validate(accessRightValidation.deleteAccessRight), accessRightController.deleteAccessRight);
// router.route('/read-accessright').post(auth(), validate(accessRightValidation.getaccessRight), accessRightController.getaccessRight);
// router.route('/create-accessright').post(auth(), validate(accessRightValidation.createaccessRight), accessRightController.createaccessRight);


// Setting Dropdown Routes
router.route('/read-all-roles-master-data').get(auth(), validate(settingValidation.getRolesMasterData), settingController.getRolesMasterData);
router.route('/read-all-alarmtimes-master-data').get(auth(), validate(settingValidation.getAlarmTimesMasterData), settingController.getAlarmTimesMasterData);
router.route('/read-all-resources-master-data').get(auth(), validate(settingValidation.getResourcesMasterData), settingController.getResourcesMasterData);
router.route('/read-all-centers-master-data').get(auth(), validate(settingValidation.getCentersMasterData), settingController.getCentersMasterData);
router.route('/read-all-centers-master-data-by-cityId').post(auth(), validate(settingValidation.getCentersMasterDataByCityId), settingController.getCentersMasterDataByCityId);
router.route('/read-all-countries-master-data').get(auth(), validate(settingValidation.getCountriesMasterData), settingController.getCountriesMasterData);
router.route('/read-all-cities-master-data').post(auth(), validate(settingValidation.getCitiesMasterData), settingController.getCitiesMasterData);
router.route('/read-all-subcenters-master-data').post(auth(), validate(settingValidation.getSubCentersMasterData), settingController.getSubCentersMasterData);
router.route('/read-all-drivers-master-data').post(auth(), validate(settingValidation.getDriversMasterData), settingController.getDriversMasterData);
router.route('/read-all-vehicles-category-master-data').get(auth(),validate(settingValidation.getVehiclesCategoryMasterData), settingController.getVehiclesCategoryMasterData)
router.route('/read-all-incident-types-master-data').get(auth(), validate(settingValidation.getIncidentTypeMasterData), settingController.getIncidentTypeMasterData);
router.route('/read-all-incident-severities-master-data').get(auth(), validate(settingValidation.getIncidentSeverityMasterData), settingController.getIncidentSeverityMasterData);
router.route('/read-all-vehicles-by-centerId-master-data').post(auth(), validate(settingValidation.getVehiclesByCenterIdMasterData), settingController.getVehiclesByCenterIdMasterData);
router.route('/find-near-by-centers').post(auth(), validate(settingValidation.getNearByCenters), settingController.getNearByCenters);
router.route('/read-all-status-types-master-data').post(auth(), validate(settingValidation.getStatusMasterData), settingController.getStatusMasterData)
router.route('/read-all-hospitals-master-data').post(auth(), validate(settingValidation.getHospitalsMasterData), settingController.getHospitalsMasterData);
router.route('/read-all-police-stations-master-data').post(auth(), validate(settingValidation.getPoliceStationsMasterData), settingController.getPoliceStationsMasterData);
router.route('/read-all-banks').get(auth(), validate(settingValidation.getBanksMasterData), settingController.getBanksMasterData);
router.route('/read-all-branch').get(auth(), validate(settingValidation.getBanksMasterData), settingController.get_Bank_Branch_MasterData);
router.route('/read-all-dept').get(auth(), validate(settingValidation.getDeptMasterData), settingController.getDeptMasterData);
router.route('/read-all-form').post(auth(), validate(settingValidation.getFormMenuMasterData), settingController.getFormMenusMasterData);
router.route('/read-all-child-forms').get(auth(), validate(settingValidation.getFormMenuMasterData), settingController.getChildsMenusByParentId);
router.route('/read-all-profile').post(auth(), validate(settingValidation.getAllEmployees), settingController.getEmployeesMasterData);
router.route('/read-salary-revision-by-employeeId').post( validate(settingValidation.getEmpSalaryRevisionByEmpId), settingController.getRevisionHistoryByEmpId);

// Donation Receipt
router.route('/get-max-booking-no').post(auth(), validate(getMaxNoFromReceipt),  getMaxbookingNoForReceipt);
//

// Dashboard API's
router.route('/read-all-vehicles-dashboard').post(auth(),validate(settingValidation.getVehiclesDashboardMasterData), settingController.getVehiclesDashboardMasterData)

router.route('/get-max-tableId').post(validate(settingValidation.getFormMenuMasterData),  settingController.GetLastInserted_ID_ByTableName);

module.exports = router;


const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/leave_management_configuration/leave_management_configuration.controller");
const itemValidation = require("../../../../validations/operations/entities/leave_management_configuration.validation");

const router = express.Router();

router.route("/create-leave-management-configuration").post(auth(), validate(itemValidation.createItem), form_controller.createleaveManagementConfiguration);
router.route("/update-leave-management-configuration").put(auth(), validate(itemValidation.updateItem), form_controller.updateleaveManagementConfiguration);
router.route("/read-all-leave-management-configuration").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllleaveManagementConfiguration);
router.route("/read-leave-management-configuration").post(auth(), validate(itemValidation.getSingleItem), form_controller.getleaveManagementConfigurationById);
router.route("/delete-leave-management-configuration/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteleaveManagementConfiguration);
router.route("/delete-leave-type-policy/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteLeaveTypePolicy);
router.route("/delete-leave-type-salary-deduction-policy/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteLeaveTypeSalaryDeduction);

module.exports = router;

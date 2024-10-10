const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const loan_management_configurationController = require("../../../../controllers/apis/operations/loan_management_configuration/loan_management_configuration.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const loan_management_configurationValidation = require("../../../../validations/operations/entities/loan_management_configuration.validation");

const router = express.Router();

router.route("/read-loan-management-configuration").post(auth(), validate(itemValidation.getReceipt), loan_management_configurationController.getloan_management_configurationById);
router.route("/read-all-loan-management-configuration").post(auth(), validate(itemValidation.getReceipts), loan_management_configurationController.getAllloan_management_configuration);

router.route("/update-loan-management-configuration").put(auth(), validate(itemValidation.updateReceipt), loan_management_configurationController.updateloan_management_configuration);
router.route("/delete-loan-management-configuration").patch(auth(),validate(itemValidation.deleteReceipt),loan_management_configurationController.deleteloan_management_configuration);


router.route("/create-loan-management-configuration").post(auth(), validate(loan_management_configurationValidation.createloan_management_configurationValidation),loan_management_configurationController.createloan_management_configuration);


module.exports = router;

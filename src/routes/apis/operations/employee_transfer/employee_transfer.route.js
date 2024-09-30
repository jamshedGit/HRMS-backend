const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const employee_transfer_controller = require("../../../../controllers/apis/operations/employee_transfer/employee_transfer.controller");

const employee_transfer_validation = require("../../../../validations/operations/entities/employee_transfer.validation");

const router = express.Router();

router.route("/read-employee-transfer").post(auth(), validate(employee_transfer_validation.createEmployeeTransfer1), employee_transfer_controller.getEmployeeTransferById);
router.route("/read-all-employee-transfer").post(auth(), employee_transfer_controller.getAllEmployeeTransfer);
// router.route("/read-all-deduction-transaction").post(auth(), earningTranController.getAllEarningTran);
router.route("/create-employee-transfer").post(auth(), validate(employee_transfer_validation.createEmployeeTransfer), employee_transfer_controller.createEmployeeTransfer);
router.route("/update-employee-transfer").put(auth(), employee_transfer_controller.updateEmployeeTransfer);
router.route("/delete-employee-transfer").patch(auth(), employee_transfer_controller.deleteEmployeeTransfer);
router.route("/create-employee-transfer-bulk").post( employee_transfer_controller.usp_InsertEmployeeTransferBulk);
router.route("/get-all-employee-transfer-history-byId").post( employee_transfer_controller.SP_getAllEmployeeTransferInfoByEmpId);


module.exports = router;

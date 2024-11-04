const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/employee_leave_balance/employee_leave_balance.controller");
const itemValidation = require("../../../../validations/operations/entities/employee_leave_balance.validation");

const router = express.Router();

router.route("/create-employee-leave-balance").post(auth(), validate(itemValidation.createItem), form_controller.createLeaveBalance);
router.route("/update-employee-leave-balance").put(auth(), validate(itemValidation.updateItem), form_controller.updateLeaveBalance);
router.route("/read-all-employee-leave-balance").post(auth(), validate(itemValidation.getAllItem), form_controller.getAllLeaveBalances);
router.route("/read-employee-leave-balance").post(auth(), validate(itemValidation.getSingleItem), form_controller.getLeaveBalanceByFilters);
// router.route("/delete-employee-leave-balance/:id").delete(auth(), validate(itemValidation.deleteSingleItem), form_controller.deleteallocateLeaves);

module.exports = router;

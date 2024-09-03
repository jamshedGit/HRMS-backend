const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const stoppage_allowanceController = require("../../../../controllers/apis/operations/stoppage_allowance/stoppage_allowance.controller");

const stoppage_allowanceValidation = require("../../../../validations/operations/entities/stoppage_allowance.validation");

const router = express.Router();

router.route("/read-stoppage").post(auth(), validate(stoppage_allowanceValidation.createStoppageAllowanceValidation1), stoppage_allowanceController.getStoppageAllowanceById);
router.route("/read-all-stoppage").post(auth(), stoppage_allowanceController.getAllStoppageAllowance);
router.route("/read-all-stoppage_by_employeeId").post(stoppage_allowanceController.SP_getAllStoppageAllowanceInfoByEmpId);
router.route("/create-stoppage").post(auth(), validate(stoppage_allowanceValidation.createStoppageAllowanceValidation), stoppage_allowanceController.createStoppageAllowance);
router.route("/update-stoppage").put(auth(), stoppage_allowanceController.updateStoppageAllowance);
router.route("/delete-stoppage").patch(auth(), stoppage_allowanceController.deleteStoppageAllowance);
router.route("/read-earning-deduction-list").post(stoppage_allowanceController.SP_getAllEarningDeductionList);


module.exports = router;

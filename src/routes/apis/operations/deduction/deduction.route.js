const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const deductionController = require("../../../../controllers/apis/operations/deduction/deduction.controller");

const deductionValidation = require("../../../../validations/operations/entities/deduction.validation");

const router = express.Router();

router.route("/read-deduction").post(auth(), validate(deductionValidation.createDeductionValidation1), deductionController.getDeductionById);
router.route("/read-all-deduction").post(auth(), deductionController.getAllDeduction);
router.route("/read-all-deduction_by_employeeId").post( deductionController.SP_getAllDeductionInfoByEmpId);
router.route("/create-deduction").post(auth(), validate(deductionValidation.createDeductionValidation), deductionController.createDeduction);
router.route("/update-deduction").put(auth(), deductionController.updateDeduction);
router.route("/delete-deduction").patch(auth(), deductionController.deleteDeduction);

module.exports = router;

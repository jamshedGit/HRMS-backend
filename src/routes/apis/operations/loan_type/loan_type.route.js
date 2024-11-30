const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const formController = require("../../../../controllers/apis/operations/loan_type/loan_type.controller");

const formValidation = require("../../../../validations/operations/entities/loan_type.validation");

const router = express.Router();

router.route("/read-loan-type").post(auth(), formController.getLoanTypeById);
router.route("/read-all-loan-type").post(auth(), formController.getAllLoanType);
router.route("/read-all-loan-type_by_employeeId").post( formController.SP_getAllLoanTypeInfoByEmpId);
router.route("/create-loan-type").post(auth(), validate(formValidation.createFormValidation), formController.createLoanType);
router.route("/update-loan-type").put(auth(), formController.updateLoanType);
router.route("/delete-loan-type").patch(auth(), formController.deleteLoanType);

module.exports = router;

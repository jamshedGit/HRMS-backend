const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const employee_loan_requestController = require("../../../../controllers/apis/operations/employee_loan_request/employee_loan_request.controller");

const employee_loan_requestValidation = require("../../../../validations/operations/entities/employee_loan_request.validation");

const router = express.Router();


router.route("/read-employee-loan-request").post(auth(), employee_loan_requestController.getEmployee_loan_requestById);
router.route("/read-all-employee-loan-request").post(auth(),employee_loan_requestController.getAllEmployee_loan_request);

router.route("/update-employee-loan-request").put(auth(),  employee_loan_requestController.updateEmployee_loan_request);
router.route("/delete-employee-loan-request").patch(auth(),employee_loan_requestController.deleteEmployee_loan_request);


router.route("/create-employee-loan-request").post(auth(),validate(employee_loan_requestValidation.CreateEmployee_loan_requestValidation),employee_loan_requestController.createEmployee_loan_request);

module.exports = router;

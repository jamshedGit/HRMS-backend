const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const empSalRevisionController = require("../../../../controllers/apis/operations/employee_salary_revision/employee_salary_revision.controller");

const employeeSalaryRevisionValidation = require("../../../../validations/operations/entities/employee_salary_setup.validation");

const router = express.Router();

router.route("/read-salary-revision").post(auth(), validate(employeeSalaryRevisionValidation.createEmployeeSalarySetupValidation1), empSalRevisionController.getAllEmployeeSalaryRevision);
router.route("/read-all-employees-salary").post( empSalRevisionController.getAllEmployeeSalaryRevision);

router.route("/create-salary-revision").post(auth(),  empSalRevisionController.createEmployeeSalaryRevision);
router.route("/update-salary-revision").put(auth(), empSalRevisionController.updateEmployeeSalaryRevision);
router.route("/delete-salary-revision").patch(auth(), empSalRevisionController.deleteEmployeeSalaryRevision);



module.exports = router;

const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const empSalController = require("../../../../controllers/apis/operations/employee_salary_setup/employee_salary_setup.controller");

const employeeSalaryValidation = require("../../../../validations/operations/entities/employee_salary_setup.validation");

const router = express.Router();

router.route("/read-employee-salary").post(auth(), validate(employeeSalaryValidation.createEmployeeSalarySetupValidation1), empSalController.getEmployeeSalaryById);
router.route("/read-all-employee-salary").post(auth(), empSalController.getAllEmployeeSalary);
// router.route("/read-all-deduction-transaction").post(auth(), earningTranController.getAllEarningTran);
router.route("/read-all-emp-earning_byId").post( empSalController.SP_getAllEmployeeSalaryInfoByEmpId);
router.route("/create-employee-salary").post(auth(), validate(employeeSalaryValidation.createEmployeeSalarySetupValidation), empSalController.createEmployeeSalary);
router.route("/update-employee-salary").put(auth(), empSalController.updateEmployeeSalary);
router.route("/delete-employee-salary").patch(auth(), empSalController.deleteEmployeeSalary);

router.route("/read-all-employees-salary").post( empSalController.getAllEmployeeSalary);

module.exports = router;

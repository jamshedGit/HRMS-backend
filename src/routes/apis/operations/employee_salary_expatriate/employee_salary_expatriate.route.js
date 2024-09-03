const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const empSalController = require("../../../../controllers/apis/operations/employee_salary_expatriate/employee_salary_expatriate.controller");

const employeeSalaryValidation = require("../../../../validations/operations/entities/employee_salary_expatriate.validation");

const router = express.Router();

router.route("/read-employee-salary-expatriate").post(auth(), validate(employeeSalaryValidation.createEmployeeSalarySetupValidation1), empSalController.getEmployeeSalaryExpatriateById);
router.route("/read-all-employee-salary-expatriate").post(auth(), empSalController.getAllEmployeeSalaryExpatriate);
// router.route("/read-all-deduction-transaction").post(auth(), earningTranController.getAllEarningTran);
router.route("/read-all-emp-earning_byId").post( empSalController.SP_getAllEmployeeSalaryExpatriateInfoByEmpId);
router.route("/read-all-compensation-employee-expatriate").post( empSalController.usp_GetCompensationExpatriatePolicyByEmpSalary);
router.route("/create-employee-salary-expatriate").post(auth(), validate(employeeSalaryValidation.createEmployeeSalaryExpatriateValidation), empSalController.createEmployeeSalaryExpatriate);
router.route("/update-employee-salary-expatriate").put(auth(), empSalController.updateEmployeeSalaryExpatriate);
router.route("/delete-employee-salary-expatriate").patch(auth(), empSalController.deleteEmployeeSalaryExpatriate);

module.exports = router;

const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const empSalController = require("../../../../controllers/apis/operations/employee_salary_earning/employee_salary_earning.controller");

const employeeSalaryValidation = require("../../../../validations/operations/entities/employee_salary_earning.validation");

const router = express.Router();

router.route("/read-employee-salary-earning").post(auth(), validate(employeeSalaryValidation.createEmployeeSalaryValidation1), empSalController.getEmployeeSalaryById);
router.route("/read-all-employee-salary-earning").post(auth(), empSalController.getAllEmployeeSalary);
router.route("/read-all-employee-salary-ddl").post( empSalController.SP_getAllEmployeeSalaryInfoForDDL);

// router.route("/read-all-deduction-transaction").post(auth(), earningTranController.getAllEarningTran);
router.route("/read-all-emp-earning_byId").post(empSalController.usp_GetAllSalary_Earning_DeductionByEmpId);
router.route("/read-compensation-grade-employeeType").post(empSalController.usp_GetAllCompensationByGradeAndEmployeeType);
router.route("/create-employee-salary-earning").post(auth(), validate(employeeSalaryValidation.createEmployeeSalaryEarningValidation), empSalController.createEmployeeSalary);
router.route("/update-employee-salary-earning").put(auth(), empSalController.updateEmployeeSalary);
router.route("/delete-employee-salary-earning").patch(auth(), empSalController.deleteEmployeeSalary);
router.route("/update-salary-earning-deduction-bulk").post( empSalController.usp_UpdateSalaryEarningDeductionBulk);
module.exports = router;

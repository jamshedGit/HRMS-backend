const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const compensation_benefits_controller = require("../../../../controllers/apis/operations/compensation_benefits/compensation_benefits.controller");

const compensation_benefit_Validation = require("../../../../validations/operations/entities/compensation_benefits.validation");

const router = express.Router();

router.route("/read-compensation-benefits").post(auth(), validate(compensation_benefit_Validation.createCompensation_Beneftis1), compensation_benefits_controller.getCompensation_BeneftisById);
router.route("/read-all-compensation-benefits").post(auth(), compensation_benefits_controller.getAllCompensation_Beneftis);
//router.route("/read-all-stoppage_by_employeeId").post(exchange_rateController.SP_getAllStoppageAllowanceInfoByEmpId);
router.route("/create-compensation-benefits").post(auth(), compensation_benefits_controller.createCompensation_Beneftis);
router.route("/update-compensation-benefits").put(auth(), compensation_benefits_controller.updateCompensation_Beneftis);
router.route("/delete-compensation-benefits").patch(auth(), compensation_benefits_controller.deleteCompensation_Beneftis);
//router.route("/read-earning-deduction-list").post(exchange_rateController.SP_getAllEarningDeductionList);
router.route("/read-all-compensation-benefits-ddl").post( compensation_benefits_controller.getAllCompensation_BeneftisForDDL);
router.route("/read-all-earning-deduction").post( compensation_benefits_controller.getAll_earning_deduction_transaction_by_compensationPKId);
router.route("/update-compensation-heads-bulk").post( compensation_benefits_controller.update_compensation_heads_bulk);
router.route("/read-all-compensation-ed-heads").post( compensation_benefits_controller.usp_GetAllCompensation_Earning_Deduction_ById);
router.route("/read-all-compensationByAttr").post( compensation_benefits_controller.GetCompensationDetailsByAttr);

module.exports = router;

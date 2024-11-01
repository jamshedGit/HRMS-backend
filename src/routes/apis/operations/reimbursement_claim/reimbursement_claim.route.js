const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const reimbursement_claimController = require("../../../../controllers/apis/operations/reimbursement_claim/reimbursement_claim.controller");

const reimbursement_claimValidation = require("../../../../validations/operations/entities/reimbursement_claim.validation");

const router = express.Router();


router.route("/read-reimbursement-claim").post(auth(), reimbursement_claimController.getreimbursement_claimById);
router.route("/read-all-reimbursement-claim").post(auth(),reimbursement_claimController.getAllreimbursement_claim);

router.route("/update-reimbursement-claim").put(auth(),  reimbursement_claimController.updatereimbursement_claim);
router.route("/delete-reimbursement-claim").patch(auth(),reimbursement_claimController.deletereimbursement_claim);


router.route("/create-reimbursement-claim").post(auth(),reimbursement_claimController.createreimbursement_claim);
router.route("/read-payroll-month").get(auth(),reimbursement_claimController.getPayrollMonth);

router.route("/read-reimbursement-configuration-policies").post(auth(),reimbursement_claimController.getreimbursement_configurationPoliciesById);

module.exports = router;

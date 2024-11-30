const express = require("express");
const auth = require("../../../../middlewares/auth");

const reimbursement_configurationController = require("../../../../controllers/apis/operations/reimbursement_configuration/reimbursement_configuration.controller");

const router = express.Router();

router.route("/read-reimbursement-configuration").post(auth(), reimbursement_configurationController.getreimbursement_configurationById);
router.route("/read-all-reimbursement-configuration").post(auth(),reimbursement_configurationController.getAllreimbursement_configuration);

router.route("/update-reimbursement-configuration").put(auth(),  reimbursement_configurationController.updatereimbursement_configuration);
router.route("/delete-reimbursement-configuration").patch(auth(),reimbursement_configurationController.deletereimbursement_configuration);


router.route("/create-reimbursement-configuration").post(auth(),reimbursement_configurationController.createreimbursement_configuration);


module.exports = router;

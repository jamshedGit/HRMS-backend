const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const compensation_exp_controller = require("../../../../controllers/apis/operations/compensation_expatriate_policy/compensation_expatriate_policy.controller");

const CompensationExpValidation = require("../../../../validations/operations/entities/compensation_expatriate.validation");

const router = express.Router();

router.route("/read-compensation-expatriate").post(auth(), validate(CompensationExpValidation.createCompensationExpValidation1), compensation_exp_controller.getCompensationExpatriateById);
router.route("/read-all-compensation-expatriate").post(auth(), compensation_exp_controller.getAllCompensationExpatriate);
// router.route("/read-all-deduction-transaction").post(auth(), earningTranController.getAllEarningTran);
router.route("/create-compensation-expatriate").post(auth(), validate(CompensationExpValidation.createCompensationExpValidation), compensation_exp_controller.createCompensationExpatriate);
router.route("/update-compensation-expatriate").put(auth(), compensation_exp_controller.updateCompensationExpatriate);
router.route("/delete-compensation-expatriate").patch(auth(), compensation_exp_controller.deleteCompensationExpatriate);

module.exports = router;

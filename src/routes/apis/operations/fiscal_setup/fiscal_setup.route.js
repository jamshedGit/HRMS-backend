const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/fiscal_setup/fiscal_setup.contoller");
const itemValidation = require("../../../../validations/operations/entities/fiscal_setup.validation");

const router = express.Router();

router.route("/read-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.get_Payroll_Process_PolicyById);
router.route("/read-all-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.getAll_Payroll_Process_Policy);
router.route("/create-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.create_Payroll_Process_Policy);
router.route("/update-fiscal-setup").put(auth(), form_controller.update_Payroll_Process_Policy);
router.route("/delete-fiscal-setup").patch(auth(),form_controller.delete_Payroll_Process_Policy);
 
module.exports = router;

const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const form_controller = require("../../../../controllers/apis/operations/fiscal_setup/fiscal_setup.contoller");
const itemValidation = require("../../../../validations/operations/entities/fiscal_setup.validation");

const router = express.Router();

router.route("/read-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.get_FiscalSetupById);
router.route("/read-all-fiscal-setup").post(auth(), form_controller.getAll_FiscalSetup);
router.route("/create-fiscal-setup").post(auth(), validate(itemValidation.createItem), form_controller.create_FiscalSetup);
router.route("/update-fiscal-setup").put(auth(), form_controller.update_FiscalSetup);
router.route("/delete-fiscal-setup").patch(auth(),form_controller.delete_FiscalSetup);
 
module.exports = router;

const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const formController = require("../../../../controllers/apis/operations/form/form.controller");
const itemValidation = require("../../../../validations/operations/entities/form.validation");
const formValidation = require("../../../../validations/operations/entities/bank.validation");
const router = express.Router();

router.route("/read-form").post(auth(), validate(itemValidation.getReceipt), formController.getFormById);
router.route("/read-all-child-forms").post(auth(), formController.getAllChildForms);
router.route("/read-all-parent-forms").post(auth(), formController.getAllParentChildForms);
router.route("/create-child-forms").post(auth(), validate(itemValidation.createForm), formController.createForm);
router.route("/update-child-forms").put(auth(), validate(itemValidation.updateForm), formController.updateForm);
router.route("/delete-child-forms").patch(auth(),validate(itemValidation.deleteForm),formController.deleteForm);
module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const { validateMortuaryFormFields } = require('../../../../middlewares/validation.middleware');
const upload = require('../../../../middlewares/upload.middleware');
const {ibFormValidation}  = require("../../../../validations");
const {mortuaryFormController} = require("../../../../controllers/apis");

// router.post('/create-ibform', upload.array('images'), validateFields, mortaurayFormController.createIbForm);
router.route("/create-mortuaryform").post(auth(),upload.array('images'), validateMortuaryFormFields, mortuaryFormController.createMortuaryForm);
router.route("/update-mortuaryform").patch(auth(),upload.array('images'), validateMortuaryFormFields, mortuaryFormController.updateMortuaryForm);
router.route("/read-mortuaryform").post(auth(),validate(ibFormValidation.getIbForm),mortuaryFormController.getMortuaryFormById);
router.route("/read-all-mortuaryforms").post(auth(),validate(ibFormValidation.getIbForms),mortuaryFormController.getMortuaryForms);
router.route("/delete-mortuaryform").patch(auth(),validate(ibFormValidation.deleteIbFormById),mortuaryFormController.deleteMortuaryFormById);
module.exports = router;


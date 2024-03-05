const express = require('express');
const router = express.Router();
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const { validateIbFormFields, validateMortuaryFormFields } = require('../../../../middlewares/validation.middleware');
const upload = require('../../../../middlewares/upload.middleware');
const {ibFormValidation, mortuaryFormValidation, coffinFormValidation}  = require("../../../../validations");
const {ibFormController, mortuaryFormController, coffinFormController} = require("../../../../controllers/apis");

// IB Form Routes
// router.post('/create-ibform', upload.array('images'), validateIbFormFields, ibFormController.createIbForm);
router.route("/create-ibform").post(auth(),upload.array('images'), validateIbFormFields, ibFormController.createIbForm);
router.route("/update-ibform").patch(auth(),upload.array('images'), validateIbFormFields, ibFormController.updateIbForm);
router.route("/read-ibform").post(auth(),validate(ibFormValidation.getIbForm),ibFormController.getIbForm);
router.route("/read-all-ibforms").post(auth(),validate(ibFormValidation.getIbForms),ibFormController.getIbForms);
router.route("/delete-ibform").patch(auth(),validate(ibFormValidation.deleteIbFormById),ibFormController.deleteIbFormById);


// Mortuary Form Routes
router.route("/create-mortuaryform").post(auth(),upload.array('images'), validateMortuaryFormFields, mortuaryFormController.createMortuaryForm);
router.route("/update-mortuaryform").patch(auth(),upload.array('images'), validateMortuaryFormFields, mortuaryFormController.updateMortuaryForm);
router.route("/read-mortuaryform").post(auth(),validate(mortuaryFormValidation.getMortuaryForm),mortuaryFormController.getMortuaryFormById);
router.route("/read-all-mortuaryforms").post(auth(),validate(mortuaryFormValidation.getMortuaryForms),mortuaryFormController.getMortuaryForms);
router.route("/delete-mortuaryform").patch(auth(),validate(mortuaryFormValidation.deleteMortuaryFormById),mortuaryFormController.deleteMortuaryFormById);

// Coffin Form Routes
router.route("/create-coffinform").post(auth(),validate(coffinFormValidation.createCoffinForm), coffinFormController.createCoffinForm);
router.route("/update-coffinform").patch(auth(),validate(coffinFormValidation.updateCoffinForm), coffinFormController.updateCoffinForm);
router.route("/read-coffinform").post(auth(),validate(coffinFormValidation.getCoffinForm),coffinFormController.getCoffinFormById);
router.route("/read-all-coffinforms").post(auth(),validate(coffinFormValidation.getCoffinForms),coffinFormController.getCoffinForms);
router.route("/delete-coffinform").patch(auth(),validate(coffinFormValidation.deleteCoffinFormById),coffinFormController.deleteCoffinFormById);

// Reporting Routes
router.route("/read-ibsreport").post(auth(),validate(ibFormValidation.getIbsReportByYear),ibFormController.getIbsReportByYear);

module.exports = router;


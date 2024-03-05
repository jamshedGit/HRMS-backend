const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const {centerController, subCenterController} = require("../../../../controllers/apis");
const {centerValidation, subCenterValidation} = require("../../../../validations");
const router = express.Router();

//Centers Routes
router.route("/read-center").post(auth(), validate(centerValidation.getCenter), centerController.getCenter);
router.route("/read-all-centers").post(auth(), validate(centerValidation.getCenters), centerController.getCenters);
router.route("/create-center").post(auth(), validate(centerValidation.createCenter), centerController.createCenter);
router.route("/update-center").put(auth(), validate(centerValidation.updateCenter), centerController.updateCenter);
router.route("/delete-center").patch(auth(), validate(centerValidation.deleteCenter), centerController.deleteCenter);


// SubCenters Routes
router.route("/read-subcenter").post(auth(), validate(subCenterValidation.getSubCenter), subCenterController.getSubCenter);
router.route("/read-all-subcenters").post(auth(), validate(subCenterValidation.getSubCenters), subCenterController.getSubCenters);
router.route("/create-subcenter").post(auth(), validate(subCenterValidation.createSubCenter), subCenterController.createSubCenter);
router.route("/update-subcenter").put(auth(), validate(subCenterValidation.updateSubCenter), subCenterController.updateSubCenter);
router.route("/delete-subcenter").patch(auth(), validate(subCenterValidation.deleteSubCenter), subCenterController.deleteSubCenter);



module.exports = router;
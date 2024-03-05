const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const subCenterController = require("../../../../controllers/apis/operations/entities/subcenter.controller");
const subCenterValidation = require("../../../../validations/operations/entities/subcenter.validation");
const router = express.Router();

router.route("/read-subcenter").post(auth(),validate(subCenterValidation.getSubCenter),subCenterController.getSubCenter);
router.route("/read-all-subcenters").post(auth(),validate(subCenterValidation.getSubCenters),subCenterController.getSubCenters);
router.route("/create-subcenter").post(auth(),validate(subCenterValidation.createSubCenter),subCenterController.createSubCenter);
router.route("/update-subcenter").put(auth(),validate(subCenterValidation.updateSubCenter),subCenterController.updateSubCenter);
router.route("/delete-subcenter").patch(auth(),validate(subCenterValidation.deleteSubCenter),subCenterController.deleteSubCenter);

module.exports = router;
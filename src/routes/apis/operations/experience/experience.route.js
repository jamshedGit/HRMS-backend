const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const experienceController = require("../../../../controllers/apis/operations/experience/experience.contoller");

const experienceValidation = require("../../../../validations/operations/entities/experience.validation");

const router = express.Router();

router.route("/read-experience").post(auth(), experienceController.getExperienceById);
router.route("/read-all-experience").post(auth(), experienceController.getAllExperience);
router.route("/create-experience").post(auth(), validate(experienceValidation.createExperienceValidation), experienceController.createExperience);
router.route("/update-experience").put(auth(), experienceController.updateExperience);
router.route("/delete-experience").patch(auth(), experienceController.deleteExperience);
router.route("/read-all-experienceById").post( experienceController.getEmployeeExperienceByEmpId);

module.exports = router;

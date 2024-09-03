const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const skillController = require("../../../../controllers/apis/operations/skills/skills.contoller");

const skillValidation = require("../../../../validations/operations/entities/skills.validation");

const router = express.Router();

router.route("/read-skills").post(auth(), validate(skillValidation.getAllAcademics), skillController.getSkillsById);
router.route("/read-all-skills").post(auth(), skillController.getAllSkills);
router.route("/read-all-skills_by_employeeId").post(skillController.sp_GetAllEmpSkillsByEmpId);
router.route("/create-skills").post(auth(), validate(skillValidation.createSkillsValidation), skillController.createSkills);
router.route("/update-skills").put(auth(), skillController.updateSkills);
router.route("/delete-skills").patch(auth(), skillController.deleteSkills);

module.exports = router;

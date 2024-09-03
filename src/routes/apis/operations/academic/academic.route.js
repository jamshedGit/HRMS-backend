const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const academicController = require("../../../../controllers/apis/operations/academic/academic.contoller");

const academicValidation = require("../../../../validations/operations/entities/academic.validation");

const router = express.Router();

router.route("/read-academic").post(auth(), validate(academicController.getAllAcademics), academicController.getAcademicById);
router.route("/read-all-academic").post(auth(), academicController.getAllAcademics);
router.route("/create-academic").post(auth(), validate(academicValidation.createAcademicValidation), academicController.createAcademic);
router.route("/update-academic").put(auth(), academicController.updateAcademic);
router.route("/delete-academic").patch(auth(), academicController.deleteAcademic);
router.route("/read-all-academic_by_empId").post( academicController.getAllAcademicByEmpId);

module.exports = router;

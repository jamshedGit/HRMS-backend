const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const incidentController = require("../../../../controllers/apis/operations/incident/incident.contoller");

const skillValidation = require("../../../../validations/operations/entities/incident.validation");

const router = express.Router();

router.route("/read-incident").post(auth(), validate(incidentController.createIncidentValidation), incidentController.getIncidentById);
router.route("/read-all-incident").post(auth(), incidentController.getAllIncident);
router.route("/read-all-incident_by_employeeId").post( incidentController.SP_getAllIncidentInfoByEmpId);
router.route("/create-incident").post(auth(), validate(incidentController.createIncidentValidation), incidentController.createIncident);
router.route("/update-incident").put(auth(), incidentController.updateIncident);
router.route("/delete-incident").patch(auth(), incidentController.deleteIncident);

module.exports = router;

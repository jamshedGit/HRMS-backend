const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const incidentSeverityController = require("../../../../controllers/apis/operations/transactions/incidentSeverity.controller");
const incidentSeverityValidation = require("../../../../validations/operations/transactions/incidentSeverity.validation");
const router = express.Router();

router.route("/read-incident-severity").post(auth(), validate(incidentSeverityValidation.getIncidentSeverity), incidentSeverityController.getIncidentSeverity);
router.route("/read-all-incident-severities").post(auth(), validate(incidentSeverityValidation.getIncidentSeverities), incidentSeverityController.getIncidentSeverities);
router.route("/create-incident-severity").post(auth(), validate(incidentSeverityValidation.createIncidentSeverity), incidentSeverityController.createIncidentSeverity);
router.route("/update-incident-severity").put(auth(), validate(incidentSeverityValidation.updateIncidentSeverity), incidentSeverityController.updateIncidentSeverity);
router.route("/delete-incident-severity").patch(auth(),validate(incidentSeverityValidation.deleteIncidentSeverity),incidentSeverityController.deleteIncidentSeverity);

module.exports = router;

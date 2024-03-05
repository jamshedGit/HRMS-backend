const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const incidentTypeController = require("../../../../controllers/apis/operations/transactions/incidentType.controller");
const incidentTypeValidation = require("../../../../validations/operations/transactions/incidentType.validation");
const router = express.Router();

router.route("/read-incident-type").post(auth(), validate(incidentTypeValidation.getIncidentType), incidentTypeController.getIncidentType);
router.route("/read-all-incident-types").post(auth(), validate(incidentTypeValidation.getIncidentTypes), incidentTypeController.getIncidentTypes);
router.route("/create-incident-type").post(auth(), validate(incidentTypeValidation.createIncidentType), incidentTypeController.createIncidentType);
router.route("/update-incident-type").put(auth(), validate(incidentTypeValidation.updateIncidentType), incidentTypeController.updateIncidentType);
router.route("/delete-incident-type").patch(auth(),validate(incidentTypeValidation.deleteIncidentType),incidentTypeController.deleteIncidentType);

module.exports = router;

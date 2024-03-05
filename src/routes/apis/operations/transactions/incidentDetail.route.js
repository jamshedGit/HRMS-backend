const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const incidentDetailController = require("../../../../controllers/apis/operations/transactions/incidentDetail.controller");
const incidentDetailValition = require("../../../../validations/operations/transactions/incidentDetail.validation");
const router = express.Router();

router.route("/read-incident-detail").post(auth(), validate(incidentDetailValition.getIncidentDetail), incidentDetailController.getIncidentDetail);
router.route("/read-all-incident-details").post(auth(), validate(incidentDetailValition.getIncidentDetails), incidentDetailController.getIncidentDetails);
router.route("/create-incident-detail").post(auth(), validate(incidentDetailValition.createIncidentDetail), incidentDetailController.createIncidentDetail);
router.route("/update-incident-detail").put(auth(), validate(incidentDetailValition.updateIncidentDetail), incidentDetailController.updateIncidentDetail);
router.route("/delete-incident-detail").patch(auth(),validate(incidentDetailValition.deleteIncidentDetail),incidentDetailController.deleteIncidentDetail);

module.exports = router;


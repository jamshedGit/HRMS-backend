const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const salarypolicyController = require("../../../../controllers/apis/operations/salarypolicy/salarypolicy.controller");

const salarypolicyValidation = require("../../../../validations/operations/entities/salarypolicy.validation");

const router = express.Router();

router.route("/read-salarypolicy").post(auth(), salarypolicyController.getsalarypolicyById);
router.route("/read-all-salarypolicy").post(auth(),  salarypolicyController.getAllsalarypolicys);

router.route("/update-salarypolicy").put(auth(), salarypolicyController.updatesalarypolicy);
router.route("/delete-salarypolicy").patch(auth(),salarypolicyController.deletesalarypolicy);


router.route("/create-salarypolicy").post(auth(), validate(salarypolicyValidation.createSalarypolicyValidation),salarypolicyController.createsalarypolicy);
router.route("/read-currentmonth").get(auth(),salarypolicyController.getCurrentMonth);

module.exports = router;

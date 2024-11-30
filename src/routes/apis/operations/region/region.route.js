const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const regionController = require("../../../../controllers/apis/operations/region/region.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const regionValidation = require("../../../../validations/operations/entities/region.validation");
const router = express.Router();

router.route("/read-region").post(auth(), validate(itemValidation.getReceipt), regionController.getRegionById);
router.route("/read-all-region").post(auth(), regionController.getAllRegion);
router.route("/create-region").post(auth(), validate(regionValidation.createRegionValidation), regionController.createRegion);
router.route("/update-region").put(auth(), validate(regionValidation.createRegionValidation), regionController.updateRegion);
router.route("/delete-region").patch(auth(),validate(regionValidation.createRegionValidation),regionController.deleteRegion);
module.exports = router;

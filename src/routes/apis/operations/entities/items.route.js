const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const itemController = require("../../../../controllers/apis/operations/entities/item.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const router = express.Router();

router.route("/read-item").post(auth(), validate(itemValidation.getItem), itemController.getItem);
router.route("/read-all-items").post(auth(), validate(itemValidation.getItems), itemController.getItems);
router.route("/create-item").post(auth(), validate(itemValidation.createItem), itemController.createItem);
router.route("/update-item").put(auth(), validate(itemValidation.updateItem), itemController.updateItem);
router.route("/delete-item").patch(auth(),validate(itemValidation.deleteItem),itemController.deleteItem);

module.exports = router;

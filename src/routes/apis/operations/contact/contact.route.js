const multer = require('multer');
const path = require('path');
const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const contactController  = require("../../../../controllers/apis/operations/contact/contact.contoller");

const empValidation = require("../../../../validations/operations/entities/contact.validation");

const router = express.Router();



router.route("/create-contact").post(auth(), validate(empValidation.createContactValidation), contactController.createContact);
router.route("/update-contact").put(auth(), contactController.updateContact);
 router.route("/delete-contact").patch(auth(), validate(), contactController.deleteContact);


// =============== COntact Info

router.route("/read-all-contact").post(auth(), contactController.SP_getAllContactList);
router.route("/read-contact").post(auth(), contactController.getContactById);


// router.post('/uploadImage',upload.single('image'),(req,res)=>{
//     console.log(req.file.filename);
//     let resp={
//         name:req.file.originalname,
//         filename:req.file.filename
//     }
//     res.json(resp)
// })

module.exports = router;

const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const reimbursement_claimController = require("../../../../controllers/apis/operations/reimbursement_claim/reimbursement_claim.controller");

const reimbursement_claimValidation = require("../../../../validations/operations/entities/reimbursement_claim.validation");

const router = express.Router();

// const storage = multer.diskStorage({
//     destination: __dirname + '/../../../../../uploads/', // Change this to your desired folder path
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname.toLowerCase().split(' ').join('-'));
//     }
// });

 
// const upload = multer({ storage: storage });
// router.route("/create-reimbursement-claim").post(auth(),reimbursement_claimController.createreimbursement_claim);
// router.route("/image-upload").post(upload.single('image'), emp_profile_Controller.imageUpload);

router.route("/read-reimbursement-claim").post(auth(), reimbursement_claimController.getreimbursement_claimById);
router.route("/read-all-reimbursement-claim").post(auth(),reimbursement_claimController.getAllreimbursement_claim);

router.route("/update-reimbursement-claim").put(auth(),  reimbursement_claimController.updatereimbursement_claim);
router.route("/delete-reimbursement-claim").patch(auth(),reimbursement_claimController.deletereimbursement_claim);


router.route("/create-reimbursement-claim").post(auth(),reimbursement_claimController.createreimbursement_claim);


module.exports = router;

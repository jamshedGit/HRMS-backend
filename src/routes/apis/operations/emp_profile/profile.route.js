const multer = require('multer');
const path = require('path');
const express = require("express");
const auth = require("../../../../middlewares/auth");
const validate = require("../../../../middlewares/validate");
const emp_profile_Controller = require("../../../../controllers/apis/operations/emp_profile/profile.controller");
const itemValidation = require("../../../../validations/operations/entities/item.validation");
const empValidation = require("../../../../validations/operations/entities/emp_profile.validation");

const router = express.Router();

//Create a storage destination for uploaded images
const storage = multer.diskStorage({
    destination: __dirname + '/../../../../../uploads/', // Change this to your desired folder path
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.toLowerCase().split(' ').join('-'));
    }
});
// var upload = multer({ dest: __dirname + '/../../../../uploadsPics/' });
 
const upload = multer({ storage: storage });
router.route("/image-upload").post(upload.single('image'), emp_profile_Controller.imageUpload);

// router.get('/api/getFile:path', (req, res) => {
//     try {
//         var file = __dirname + './uploads/' + req.params.path;
//         console.log(file);
//         var filename = path.basename(file);
//         var mimetype = mime.getType(file);

//         res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//         res.setHeader('Content-type', mimetype);
//         var filestream = fs.createReadStream(file);
//         filestream.pipe(res);
//     } catch (error) {
//         return res.json(error)
//     }
// })

router.route("/read-profile").post(auth(), validate(itemValidation.getReceipt), emp_profile_Controller.getEmp_profileById);
router.route("/read-all-profile").post(auth(), emp_profile_Controller.getAllEmp_profile);

// router.route("/read-all-profile").post(auth(), emp_profile_Controller.getAllEmp_profile);

router.route("/create-profile").post(auth(),upload.single('image'), validate(empValidation.createEmp_profileValidation), emp_profile_Controller.createEmp_profile);
router.route("/update-profile").put(auth(), validate(itemValidation.updateReceipt), emp_profile_Controller.updateEmp_profile);
router.route("/delete-profile").patch(auth(), validate(itemValidation.deleteReceipt), emp_profile_Controller.deleteEmp_profile);


// =============== COntact Info

router.route("/read-all-contact").post(auth(), emp_profile_Controller.getAllContactInfo);
router.route("/read-contact").post(auth(), emp_profile_Controller.getContactInfoByEmployeeId);
router.route("/update-contact").put(auth(),validate(empValidation.createEmp_profileValidation), emp_profile_Controller.updateContactById);
router.route("/read-all-employee-profile").post( emp_profile_Controller.usp_GetAllEmployeeProfileDetails);


// router.post('/uploadImage',upload.single('image'),(req,res)=>{
//     console.log(req.file.filename);
//     let resp={
//         name:req.file.originalname,
//         filename:req.file.filename
//     }
//     res.json(resp)
// })

module.exports = router;

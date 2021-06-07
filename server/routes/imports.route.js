const express = require("express");
const User = require("../models/user.model");
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

const uploadFolder = __basedir + '/uploads/';
const exports_folder = __basedir + '/downloads/';
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, uploadFolder)
	},
	filename: (req, file, cb) => {
	  cb(null, file.originalname)
	}
});
 
var upload = multer({storage: storage});


let uploadFile = (req, res) => {
    console.log(req)
    console.log(req.file)
    console.log(req.file.filename)
    
    
	res.send('File uploaded successfully! -> filename = ');
}
 
let download_table_file = (component) => {

	let download_xxxxx_table_file = (req, res) => {
		let filter_bar = req.params.params
		console.log(`exporting ${component} with filter bar: ${filter_bar}`)
		if (component == 'student') {

		} else if (component == 'instrument') {
			
		} else if (component == 'maintainer') {
			
		} else if (component == 'loan') {
			
		}
		res.download(exports_folder + 'CV.pdf');  
	}

	return download_xxxxx_table_file
}


let download_file = (component) => {

	let download_xxxxx_file = (req, res) => {
		let id = req.params.id
		console.log(`exporting ${component} with ID: ${id}`)
		if (component == 'student') {

		} else if (component == 'instrument') {
			
		} else if (component == 'maintainer') {
			
		} else if (component == 'loan') {
			
		}
		res.download(exports_folder + 'CV.pdf');  
	}

	return download_xxxxx_file
}

router.post("/students", upload.single("file"), uploadFile);

router.post("/instruments", upload.single("file"), uploadFile);

router.post("/maintainers", upload.single("file"), uploadFile);


router.get("/students/:id", download_file('student'));

router.get("/instruments/:id", download_file('instrument'));

router.get("/maintainers/:id", download_file('maintainer'));

router.get("/loans", download_file('loan'));

router.get("/students/table/:params", download_table_file('student'));

router.get("/instruments/table/:params", download_table_file('instrument'));

router.get("/maintainers/table/:params", download_table_file('maintainer'));

router.get("/loans/table/:params", download_table_file('loan'));


module.exports = router;

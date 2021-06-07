const express = require("express");
const User = require("../models/user.model");
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const csv = require('csvtojson');
const Student = require("../models/student.model");
const uploadFolder = __basedir + '/uploads/';
const exports_folder = __basedir + '/downloads/';
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Instrument = require("../models/instrument.model");
const Loan = require("../models/loan.model")




var storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, uploadFolder)
	},
	filename: (req, file, cb) => {
	  cb(null, file.originalname)
	}
});

var upload = multer({storage: storage});

let uploadFile = (compononet) => {
	let upload_component_file = (req, res) => {
		console.log(`+++++++++\n\timporting file for component \"${compononet}\"\n\tfile path is \"${req.file.filename}\"\n+++++++++`)
		if(compononet== 'student'){
		csv()
		.fromFile("server/uploads/" + req.file.filename)         ////  server/files/excel3.csv
		.then((jsonObj)=>{
			Student.insertMany(jsonObj,(err,data)=>{
					if(err){
					  console.log(err);
					  return res.status(500);
					}else{
						res.redirect('/');
					}
			});
		  });
    }else if(compononet == 'instrument'){
      csv()
		.fromFile("server/uploads/" + req.file.filename)         ////  server/files/excel3.csv
		.then((jsonObj)=>{
			Instrument.insertMany(jsonObj,(err,data)=>{
					if(err){
					  console.log(err);
					  return res.status(500);
					}else{
						res.redirect('/');
					}
			});
		  });
    }else if(compononet == 'maintainer'){
      csv()
      .fromFile("server/uploads/" + req.file.filename)         ////  server/files/excel3.csv
      .then((jsonObj)=>{
        Maintainer.insertMany(jsonObj,(err,data)=>{
            if(err){
              console.log(err);
              return res.status(500);
            }else{
              res.redirect('/');
            }
        });
        });
    }

		res.send('File uploaded successfully!');
	}
	return upload_component_file
}

let download_table_file = (component) => {

	let download_xxxxx_table_file = (req, res) => {
		let filter_bar = req.params.params
		let filterString=req.params.params.split('-');
		let discreteFields = filterString[0].split('_');

		console.log(`exporting ${component} with filter bar: ${filter_bar}`)
		let path="";
    if (component == 'student') {
      let Class = discreteFields[0];
      let level = discreteFields[1];

      let map = {}
      Class !=='class' ? map['class'] = Class:1;
      level !== 'level' ?  map['level'] = level:1;
      Student.find(map).then(students=>{
        if(students){
          const csvWriter = createCsvWriter({
            path: "server/files/students.csv",
            header: [
              { id: "_id", title: "_id" },
              { id: "fName", title: "first name" },
              { id: "lName", title: "last name" },
              { id: "school", title: "school" },
              { id: "level", title: "level" },
              { id: "class", title: "class" },
              { id: "parent1Name", title: "parent1Name" },
              { id: "parent2Name", title: "parent2Name" },
              { id: "parent1PhoneNumber", title: "parent1PhoneNumber" },
              { id: "parent2PhoneNumber", title: "parent2PhoneNumber" },
              { id: "parent1Email", title: "parent1Email" },
              { id: "parent2Email", title: "parent2Email" },
              //to be continued
            ]
          });


          csvWriter
            .writeRecords(students)
            .then(()=>
              console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
           );
        }
      })
      path= __dirname.slice(0,__dirname.length-6)+'files\\students.csv';
		} else if (component == 'instrument') {
      let type = discreteFields[0];
      let subtype = discreteFields[1];
      let status = discreteFields[2];
      let map = {}
      type !=="type" ?  map['type'] = type:1;
      subtype !== "subtype" ? map['sub_type'] = subtype:1;
      status !== "status" ? map['status'] = status:1;
      Instrument.find(map).then(instruments=>{
        if(instruments){
          const csvWriter = createCsvWriter({
            path: "server/files/instruments.csv",
            header: [
              { id: "_id", title: "_id" },
              { id: "generalSerialNumber", title: "general serial number" },
              { id: "type", title: "type" },
              { id: "sub_type", title: "sub type" },
              { id: "company", title: "company" },
              { id: "style", title: "style" },
              { id: "imprentedSerialNumber", title: "imprented Serial Number" },
              { id: "ownership", title: "ownership" },
              { id: "status", title: "status" },
              //to be continued
            ]
          });

          csvWriter
            .writeRecords(instruments)
            .then(()=>
              console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
           );

        }
      })
      path= __dirname.slice(0,__dirname.length-6)+'files\\instruments.csv';
		} else if (component == 'maintainer') {


		} else if (component == 'loan') {
      let map = {}

      let type = discreteFields[0];
      let subtype = discreteFields[1];
      let status = discreteFields[2];
      let class_ = discreteFields[3];
      let level = discreteFields[4];
      type !=="studentLevel" ?  map['type'] = type:1;
      subtype !== "studentsClass" ? map['sub_type'] = subtype:1;
      status !== "status" ? map['status'] = status:1;
      class_ !== "instrumentType" ? map['class'] = status:1;
      level !== "instrumentSubtype" ? map['level'] = status:1;
      let from = req.query.from.split('_');
      let from_date = new Date(from[2],from[1]-1,from[0]);
      let to = req.query.to.split('_');
      let to_date = new Date(to[2],to[1]-1,to[0]);
      console.log(to_date.toDateString());
      var datetime = new Date("1-4-2021");
      console.log(from_date < datetime &&  datetime < to_date);
      let k=[];
      Loan.find().populate({path: 'instrument',
      match: map}).populate({path: 'student',
      match: map}).populate('openUser')
      .populate('closeUser').then(loans => {

        let j=0;
        for (let index = 0; index < loans.length; index++) {
          const element = loans[index];
          console.log(element.from);
          let loan_date = element.from.split('-');
          loan_date = new Date(loan_date[0],loan_date[1]-1,loan_date[2]);
          if(from_date < loan_date &&  loan_date < to_date && element.student!=null && element.instrument!=null){
            console.log(element);
            k[j] = element;
            j++;
          }

        }
        return k;
      }).then(k=>{
        const csvWriter = createCsvWriter({
        path: "server/files/loans.csv",
        header: [
          { id: "_id", title: "_id" },
          { id: "student", title: "student" },
          { id: "instrument", title: "instrument" },
          { id: "from", title: "from" },
          { id: "to", title: "to" },
          { id: "openUser", title: "openUser" },
          { id: "closeUser", title: "closeUser" },
          { id: "notes", title: "notes" },
          { id: "status", title: "status" },
          //to be continued
        ]
      });

      csvWriter
        .writeRecords(k)
        .then(()=>
          console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
      );

    })
    path= __dirname.slice(0,__dirname.length-6)+'files\\loans.csv';
		}
    console.log(path);
		res.download(path);
	}

	return download_xxxxx_table_file
}


let download_file = (component) => {

	let download_xxxxx_file = (req, res) => {
		let id = req.params.id
		console.log(`exporting ${component} with ID: ${id}`)
    let path="";
		if (component == 'student') {
      Student.find({_id: id}).then(students=>{
        if(students){
          console.log(students);
          const csvWriter = createCsvWriter({
            path: "server/files/students3.csv",
            header: [
              { id: "_id", title: "_id" },
              { id: "fName", title: "first name" },
              { id: "lName", title: "last name" },
              { id: "school", title: "school" },
              { id: "level", title: "level" },
              { id: "class", title: "class" },
              { id: "parent1Name", title: "parent1Name" },
              { id: "parent2Name", title: "parent2Name" },
              { id: "parent1PhoneNumber", title: "parent1PhoneNumber" },
              { id: "parent2PhoneNumber", title: "parent2PhoneNumber" },
              { id: "parent1Email", title: "parent1Email" },
              { id: "parent2Email", title: "parent2Email" },
              //to be continued
            ]
          });
          csvWriter
            .writeRecords(students)
            .then(()=>
              console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!a")
           );
        }
      })
      path= __dirname.slice(0,__dirname.length-6)+'files\\students3.csv';
		} else if (component == 'instrument') {
      Instrument.findOne({_id: id}).then(instruments=>{
        if(instruments){
          const csvWriter = createCsvWriter({
            path: "server/files/instruments.csv",
            header: [
              { id: "_id", title: "_id" },
              { id: "generalSerialNumber", title: "general serial number" },
              { id: "type", title: "type" },
              { id: "sub_type", title: "sub type" },
              { id: "company", title: "company" },
              { id: "style", title: "style" },
              { id: "imprentedSerialNumber", title: "imprented Serial Number" },
              { id: "ownership", title: "ownership" },
              { id: "status", title: "status" },
              //to be continued
            ]
          });

          csvWriter
            .writeRecords(instruments)
            .then(()=>
              console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
           );

        }
      })

      path= __dirname.slice(0,__dirname.length-6)+'files\\instruments.csv';
		} else if (component == 'maintainer') {
      //
		} else if (component == 'loan') {
      Loan.findOne({_id: id}).then(k=>{
        const csvWriter = createCsvWriter({
        path: "server/files/loans.csv",
        header: [
          { id: "_id", title: "_id" },
          { id: "student", title: "student" },
          { id: "instrument", title: "instrument" },
          { id: "from", title: "from" },
          { id: "to", title: "to" },
          { id: "openUser", title: "openUser" },
          { id: "closeUser", title: "closeUser" },
          { id: "notes", title: "notes" },
          { id: "status", title: "status" },
          //to be continued
        ]
      });

      csvWriter
        .writeRecords(k)
        .then(()=>
          console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
      );

    })
    path= __dirname.slice(0,__dirname.length-6)+'files\\loans.csv';
		}
		res.download(path);
	}

	return download_xxxxx_file
}

router.post("/students", upload.single("file"), uploadFile("student"));

router.post("/instruments", upload.single("file"), uploadFile("instrument"));

router.post("/maintainers", upload.single("file"), uploadFile("maintainer"));


router.get("/students/:id", download_file('student'));

router.get("/instruments/:id", download_file('instrument'));

router.get("/maintainers/:id", download_file('maintainer'));

router.get("/loans/:id", download_file('loan'));


router.get("/table/students/:params", download_table_file('student'));

router.get("/table/instruments/:params", download_table_file('instrument'));

router.get("/table/maintainers/:params", download_table_file('maintainer'));

router.get("/table/loans/:params", download_table_file('loan'));

module.exports = router;

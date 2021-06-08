const express = require("express");
const User = require("../models/user.model");
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const csv = require('csvtojson');
const Student = require("../models/student.model");
const Fix = require("../models/fixes.model");
const uploadFolder = __basedir + '/uploads/';
const exports_folder = __basedir + '/downloads/';
const files_folder = __basedir + '/files/';

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Instrument = require("../models/instrument.model");
const Maintainer = require("../models/maintainer.model");
const Loan = require("../models/loan.model");
const { populate } = require("../models/loan.model");
const { json } = require("body-parser");




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
      let data = []
      for(let i=0;i<jsonObj.length;i++){
        let arr = Object.values(jsonObj[i])
        let d= {}
        d['fName'] = arr[0]
        d['lName'] = arr[1]
        d['school'] = arr[2]
        d['level'] = arr[3]
        d['class'] = arr[4]
        arr[5] == undefined? 1:d['parent1Name'] = arr[5];
        arr[6] == undefined? 1:d['parent2Name'] = arr[6];
        arr[7] == undefined? 1:d['parent1PhoneNumber'] = arr[7];
        arr[8] == undefined? 1:d['parent2PhoneNumber'] = arr[8];
        arr[9] == undefined? 1:d['parent1Email'] = arr[9];
        arr[10] == undefined? 1:d['parent2Email'] = arr[10];
        data.push(d);
      }
			Student.insertMany(data,(err,data)=>{
					if(err){
					  console.log(err);
					}else{
						res.redirect('/');
					}
			});

		  });
    }else if(compononet == 'instrument'){
      csv()
		.fromFile("server/uploads/" + req.file.filename)         ////  server/files/excel3.csv
		.then((jsonObj)=>{
      let data = []
      for(let i=0;i<jsonObj.length;i++){
        let arr = Object.values(jsonObj[i])
        let d= {}
        d['generalSerialNumber'] = arr[0]
        d['type'] = arr[1]
        d['sub_type'] = arr[2]
        d['company'] = arr[3]
        d['style'] = arr[4]
        d['imprentedSerialNumber'] = arr[5];
        d['ownership'] = arr[6];
        d['status'] = arr[7];
        data.push(d);
      }
			Instrument.insertMany(data,(err,data)=>{
					if(err){
					  console.log(err);
					}else{
						res.redirect('/');
					}
			});
		  });
    }else if(compononet == 'maintainer'){
      csv()
      .fromFile("server/uploads/" + req.file.filename)         ////  server/files/excel3.csv
      .then((jsonObj)=>{
      let data = []
      for(let i=0;i<jsonObj.length;i++){
        let arr = Object.values(jsonObj[i])
        let d= {}
        d['maintainerName'] = arr[0]
        d['maintainerPhone'] = arr[1]
        d['maintainerAddress'] = arr[2]

        data.push(d);
      }
        Maintainer.insertMany(data,(err,data)=>{
            if(err){
              console.log(err);
            }else{
              res.redirect('/');
            }
        });
        });
    }

		res.status('200');
	}
	return upload_component_file
}

let download_table_file = (component) => {

	let download_xxxxx_table_file = (req, res) => {
    // if(component == 'maintainers')
		let filter_bar = req.params.params != undefined ? req.params.params : ''
		let filterString = req.params.params != undefined ? req.params.params.split('-') : []
		let discreteFields = req.params.params != undefined ?  filterString[0].split('_') : ''

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
      path= __dirname.slice(0,__dirname.length-6)+'files/students.csv';
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
      path= __dirname.slice(0,__dirname.length-6)+'files/instruments.csv';
		} else if (component == 'maintainer') {
      Maintainer.find().then(result=>{
        const csvWriter = createCsvWriter({
          path: "server/files/maintainers.csv",
          header: [
            { id: "_id", title: "_id" },
            { id: "maintainerName", title: "maintainer name" },
            { id: "maintainerPhone", title: "maintainer phone" },
            { id: "maintainerAddress", title: "maintainre address"}
          ]
        });

        csvWriter
          .writeRecords(result)
          .then(()=>
            console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
        );
      });
      path= __dirname.slice(0,__dirname.length-6)+'files/maintainers.csv';
		} else if (component == 'loan') {
      let map1 = {}
      let map3 = {}
      let map2={}

      let subtype = discreteFields[4];
      let type = discreteFields[3];
      let status = discreteFields[2];
      let class_ = discreteFields[1];
      let level = discreteFields[0];
      level !=="studentLevel" ?  map1['level'] = level:1;
      class_ !== "studentClass" ? map1['class'] = class_:1;
      status !== "status" ? map2['status'] = status:1;
      type !== "instrumentType" ? map3['type'] = type:1;
      subtype !== "instrumentSubtype" ? map3['subtype'] = subtype:1;
      let from="1_1_1900".split('_');
      let to="31_12_2200".split('_');
      if(req.query.from && req.query.to){
        from = req.query.from.split('_');
        to = req.query.to.split('_');
      }
      let from_date = new Date(from[2],from[1]-1,from[0]);
      let to_date = new Date(to[2],to[1]-1,to[0]);

      Loan.find(map2).populate({path: 'instrument', select:'generalSerialNumber type sub_type style imprentedSerialNumber ownership status company  -_id',
      match: map3}).populate({path: 'student',select:'fName lName school level class -_id',
      match: map1}).populate({path:'openUser' ,select:'name username -_id',})
      .populate({path:'closeUser' ,select:'name username -_id',}).then(loans => {
        let k=[];
        let j=0;
        for (let index = 0; index < loans.length; index++) {
          const element = loans[index];
          let loan_date = element.from.split('-');
          loan_date = new Date(loan_date[0],loan_date[1]-1,loan_date[2]);
          console.log(from_date);
          console.log(to_date);
          if(from_date < loan_date &&  loan_date < to_date && element.student!=null && element.instrument!=null){
            console.log(element);
            k[j] = element;
            j++;
          }

        }
        console.log(k);
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
    path= __dirname.slice(0,__dirname.length-6)+'files/loans.csv';

		}else if (component == 'fix'){
      let map = {}
      let map2={}

      let subtype = discreteFields[2];
      let type = discreteFields[1];
      let status = discreteFields[0];

      status !== "status" ? map2['status'] = status:1;
      type !== "instrumentType" ? map['type'] = type:1;
      subtype !== "instrumentSubtype" ? map['subtype'] = subtype:1;
      console.log(map);
      console.log(map2);
      let from="1_1_1900".split('_');
      let to="31_12_2200".split('_');
      if(req.query.from && req.query.to){
        from = req.query.from.split('_');
        to = req.query.to.split('_');
      }
      let from_date = new Date(from[2],from[1]-1,from[0]);
      let to_date = new Date(to[2],to[1]-1,to[0]);

      Fix.find(map2)
      .populate({path: 'instrument',select:'generalSerialNumber type sub_type style imprentedSerialNumber ownership status company  -_id',
      match: map})
      .populate({path: 'maintainer', select: 'maintainerName maintainerPhone maintainerAddress -_id'})
      .populate({path:'openUser' ,select:'name username -_id',})
      .populate({path:'closeUser' ,select:'name username -_id',}).then(fixes => {
        let k=[];
        let j=0;
        for (let index = 0; index < fixes.length; index++) {
          const element = fixes[index];
          let fix_date = element.from.split('-');
          fix_date = new Date(fix_date[0],fix_date[1]-1,fix_date[2]);
          if(from_date < fix_date &&  fix_date < to_date  && element.instrument!=null){
            k[j] = element;
            j++;
          }

        }
        return k;
      }).then(k=>{
        const csvWriter = createCsvWriter({
        path: "server/files/fixes.csv",
        header: [
          { id: "_id", title: "_id" },
          { id: "maintainer", title: "maintainer" },
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
    path= __dirname.slice(0,__dirname.length-6)+'files/fixes.csv';
    }
      setTimeout(function () {
      console.log(path);
      res.download(path);
    }, 1000)

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
            path: "server/files/student.csv",
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
      path= __dirname.slice(0,__dirname.length-6)+'files/student.csv';
		} else if (component == 'instrument') {
      Instrument.find({_id: id}).then(instruments=>{
        if(instruments){
          const csvWriter = createCsvWriter({
            path: "server/files/instrument.csv",
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

      path= __dirname.slice(0,__dirname.length-6)+'files/instrument.csv';
		} else if (component == 'maintainer') {
      Maintainer.find({_id:id}).then(result=>{
        const csvWriter = createCsvWriter({
          path: "server/files/maintainer.csv",
          header: [
            { id: "_id", title: "_id" },
            { id: "maintainerName", title: "maintainer name" },
            { id: "maintainerPhone", title: "maintainer phone" },
            { id: "maintainerAddress", title: "maintainre address"}
          ]
        });

        csvWriter
          .writeRecords(result)
          .then(()=>
            console.log("Write to bezkoder_mongodb_csvWriter.csv successfully!")
        );
      });
      path= __dirname.slice(0,__dirname.length-6)+'files/maintainer.csv';
		} else if (component == 'loan') {
      Loan.find({_id: id})
      .populate({path: 'instrument', select:'generalSerialNumber type sub_type style imprentedSerialNumber ownership status company  -_id'})
      .populate({path: 'student',select:'fName lName school level class -_id'})
      .populate({path:'openUser' ,select:'name username -_id',})
      .populate({path:'closeUser' ,select:'name username -_id',}).then(k=>{
        const csvWriter = createCsvWriter({
        path: "server/files/loan.csv",
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
    path= __dirname.slice(0,__dirname.length-6)+'files/loan.csv';
		} else if(component == 'fix'){
      Fix.find({_id:id}).populate({path: 'instrument',select:'generalSerialNumber type sub_type style imprentedSerialNumber ownership status company  -_id'})
      .populate({path: 'maintainer', select: 'maintainerName maintainerPhone maintainerAddress -_id'})
      .populate({path:'openUser' ,select:'name username -_id',})
      .populate({path:'closeUser' ,select:'name username -_id',})
      .then(k=>{
        const csvWriter = createCsvWriter({
          path: "server/files/fix.csv",
          header: [
            { id: "_id", title: "_id" },
            { id: "maintainer", title: "maintainer" },
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
      });
      path= __dirname.slice(0,__dirname.length-6)+'files/fix.csv';
    }
		setTimeout(function () {
      console.log(path);
      res.download(path);
    }, 1000)
	}

	return download_xxxxx_file
}

router.post("/students", upload.single("file"), uploadFile("student"));

router.post("/instruments", upload.single("file"), uploadFile("instrument"));

router.post("/maintainers", upload.single("file"), uploadFile("maintainer"));


router.get("/students/:id", download_file('student'));

router.get("/instruments/:id", download_file('instrument'));

router.get("/maintainers/:id", download_file('maintainer'));

router.get("/fixes/:id", download_file('fix'));

router.get("/loans/:id", download_file('loan'));


router.get("/table/students/:params", download_table_file('student'));

router.get("/table/instruments/:params", download_table_file('instrument'));

router.get("/table/maintainers/", download_table_file('maintainer'));

router.get("/table/fixes/:params", download_table_file('fix'));

router.get("/table/loans/:params", download_table_file('loan'));


module.exports = router;

const express = require("express");
const Loan = require("../models/loan.model")
const Student = require("../models/student.model")
const Instrument = require("../models/instrument.model")
const User = require("../models/user.model")
const checkAuth= require("../middleware/check-auth");
const querystring = require('querystring');
const History = require("../models/history.model");

const router = express.Router();

router.post("/loanInstrument", (req, res, next)=>{
    Instrument.findOne({_id: req.body.instrument})
    .then(result => {
        if(result.status === "available") {
            var datetime = new Date();
            const loan = new Loan({
                student: req.body.student,
                instrument: req.body.instrument,
                openUser: req.body.user,
                from: datetime.toISOString().slice(0,10),
                notes: req.body.notes,
                status: 'openned'
            });
            loan.save()
            .then(result => {
                res.status(201).json({
                  message: "success",
                  data: loan.id
                });
                const instrument1 = new Instrument({
                    _id:req.body.instrument,
                    status: "loaned"
                  });
                  var datetime = new Date();
                  const history_rec = new History({
                    instrument: req.body.instrument,
                    date: datetime.toISOString().slice(0,10),
                    user: req.body.user,
                    status: "loaned",
                    notes: req.body.notes
                  });
                  history_rec.save();
                Instrument.updateOne({_id: req.body.instrument}, instrument1, function(err, res) {
                    if(err) console.log(err);
                    console.log("updated");
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                  message: "failed"
                });
            });
        }
        else {
            res.status(400).json({
              message: "failed"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "failed"
        })
    })
});

router.get("", (req, res, next)=>{

    Loan.find()
    .populate('student')
    .populate('instrument')
    .populate('openUser')
    .populate('closeUser').then(loans => {
        if(loans) {
            res.status(200).json({
                message: "success",
                data: loans
            });
        }
        else {
            res.status(404).json({
              message: "failed"
            })
        }
    })
});

router.post("/endLoan/:id", (req, res, next)=>{
  const loan =  new Loan({
    _id: req.params.id,
    closeUser: req.body.user,
    to: req.body.to,
    status: 'closed'
  });
  Loan.findOneAndUpdate({_id: req.params.id},loan).then(result => {
    res.status(200).json({
      message: "success",
      data: req.params.id
    });
    const instrument1 = new Instrument({
      _id: result.instrument,
      status: "available"              // TODO -  neeed to check
    });
    var datetime = new Date();
    const history_rec = new History({
      instrument: result.instrument,
      date: datetime.toISOString().slice(0,10),
      user: req.headers.user_id,
      status: "available",
      notes: req.body.notes
    });
    history_rec.save();
    Instrument.updateOne({_id: result.instrument}, instrument1, function(err, res) {
        if(err) console.log(err);
        console.log("updated");
    });
    })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: "failed",
    });
  })
});


router.get("/filter/:params", (req, res, next)=>{
  let filterString=req.params.params.split('-');
  let discreteFields = filterString[0].split('_');
  let map = {}

  let type = discreteFields[0];
  let subtype = discreteFields[1];
  let status = discreteFields[2];
  let class_ = discreteFields[3];
  let level = discreteFields[4];
  type !=="type" ?  map['type'] = type:1;
  subtype !== "subtype" ? map['sub_type'] = subtype:1;
  status !== "status" ? map['status'] = status:1;
  class_ !== "class" ? map['class'] = status:1;
  level !== "level" ? map['level'] = status:1;
  console.log(map);
  let from = req.query.from.split('_');
  let from_date = new Date(from[2],from[1]-1,from[0]);
  let to = req.query.to.split('_');
  let to_date = new Date(to[2],to[1]-1,to[0]);
  console.log(to_date.toDateString());
  var datetime = new Date("1-4-2021");
  console.log(from_date < datetime &&  datetime < to_date);
  Loan.find().populate({path: 'instrument',
  match: map}).then(loans => {
    let k=[];
    let j=0;
    for (let index = 0; index < loans.length; index++) {
      const element = loans[index];
      console.log(element.from);
      let loan_date = element.from.split('-');
      loan_date = new Date(loan_date[0],loan_date[1]-1,loan_date[2]);
      console.log(loan_date.toDateString());
      if(from_date < loan_date &&  loan_date < to_date && element.instrument !=null && element.student!=null){
        k[j] = element;
        j++;
      }

    }
    return k;
  }).then(k=>{
        res.status(200).json({
          message: "success",
          data: k
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "failed"
        });
   });
  // let filterString=req.params.params.split('-');
  // let discreteFields = filterString[0].split('_');
  // let serialNum = filterString[1];
  // let type = discreteFields[0];
  // let subtype = discreteFields[1];
  // let status = discreteFields[2];

  // if (type == "type" && subtype == 'subtype' && status == 'status')
  //   Instrument.find({generalSerialNumber: {"$regex": serialNum, "$options": "i"}}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

  // if (type == "type" && subtype == 'subtype' && status != 'status')
  //   Instrument.find({status: status}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

  // if (type == "type" && subtype != 'subtype' && status == 'status')
  //   Instrument.find({sub_type: subtype}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

  // if (type != "type" && subtype == 'subtype' && status == 'status')
  //   Instrument.find({type: type}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

  // if (type == "type" && subtype != 'subtype' && status != 'status')
  //   Instrument.find({sub_type: subtype,status: status}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

  // if (type != "type" && subtype == 'subtype' && status != 'status')
  //   Instrument.find({type: type,status: status}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

  // if (type != "type" && subtype != 'subtype' && status == 'status')
  //   Instrument.find({type: type,sub_type: subtype}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

  // if (type != "type" && subtype != 'subtype' && status != 'status')
  //   Instrument.find({type: type,sub_type: subtype,status: status}).then(instruments => {
  //     if(!instruments){
  //       res.status(500).json({
  //         message: "failed"
  //       });
  //     }
  //     return instruments;
  //   })
  //   .then(instruments=>{
  //     res.status(200).json({
  //       message: "success",
  //       data: instruments
  //       });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       message: "failed"
  //     });
  //   });

});

module.exports = router;

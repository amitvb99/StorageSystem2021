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
              message: "failed: the instrument is not available"
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
          loans.forEach(loan => {
            if(loan.status == 'closed' && loan.closeUser==null){
              loan['closeUser'] = {_id:'admin', name:'admin', username:'admin'}
            }
          })

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
router.get("/:id", (req, res, next)=>{
  Loan.findOne({_id: req.params.id})
  .populate('student')
  .populate('instrument')
  .populate('openUser')
  .populate('closeUser').then(loan => {
      if(loan) {
          res.status(200).json({
              message: "success",
              data: loan
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
  var datetime = new Date();
  const loan =  new Loan({
    _id: req.params.id,
    closeUser: req.headers.user_id,
    to: datetime.toISOString().slice(0,10),
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
      notes: ""
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
  let map2={}

  let subtype = discreteFields[4];
  let type = discreteFields[3];
  let status = discreteFields[2];
  let class_ = discreteFields[1];
  let level = discreteFields[0];
  level !=="studentLevel" ?  map['level'] = level:1;
  class_ !== "studentClass" ? map['class'] = class_:1;
  status !== "status" ? map2['status'] = status:1;
  type !== "instrumentType" ? map['type'] = type:1;
  subtype !== "instrumentSubtype" ? map['subtype'] = subtype:1;

  let from="1_1_1900".split('_');
  let to="31_12_2200".split('_');
  if(req.query.from && req.query.to){
    from = req.query.from.split('_');
    to = req.query.to.split('_');
  }
  let from_date = new Date(from[2],from[1]-1,from[0]);
  let to_date = new Date(to[2],to[1]-1,to[0]);

  Loan.find(map2).populate({path: 'instrument',
  match: map}).populate({path: 'student',
  match: map}).populate('openUser')
  .populate('closeUser').then(loans => {
    let k=[];
    let j=0;
    for (let index = 0; index < loans.length; index++) {
      const element = loans[index];
      let loan_date = element.from.split('-');
      loan_date = new Date(loan_date[0],loan_date[1]-1,loan_date[2]);
      if(from_date < loan_date &&  loan_date < to_date && element.student!=null && element.instrument!=null){
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

});

module.exports = router;

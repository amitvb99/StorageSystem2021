const express = require("express");
const Loan = require("../models/loan.model")
const Fix = require("../models/fixes.model")
const Student = require("../models/student.model")
const Instrument = require("../models/instrument.model")
const User = require("../models/user.model")
const checkAuth= require("../middleware/check-auth");
const querystring = require('querystring');
const History = require("../models/history.model");

const router = express.Router();

router.post("/fix", (req, res, next)=>{
    Instrument.findOne({_id: req.body.instrument})
    .then(result => {
        if(result.status === "available") {
            var datetime = new Date();
            const fix = new Fix({
                maintainer: req.body.maintainer,
                instrument: req.body.instrument,
                openUser: req.body.user,
                from: datetime.toISOString().slice(0,10),
                notes: req.body.notes,
                status: 'inProgress'
            });
            fix.save()
            .then(result => {
                res.status(201).json({
                  message: "success",
                  data: fix.id
                });
                const instrument1 = new Instrument({
                    _id:req.body.instrument,
                    status: "inFix"
                  });
                  var datetime = new Date();
                  const history_rec = new History({
                    instrument: req.body.instrument,
                    date: datetime.toISOString().slice(0,10),
                    user: req.body.user,
                    status: "sent to fix",
                    notes: req.body.notes
                  });
                  history_rec.save();
                Instrument.updateOne({_id: req.body.instrument}, instrument1, function(err, res) {
                    if(err) console.log(err);
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
    Fix.find()
    .populate('maintainer')
    .populate('instrument')
    .populate('openUser')
    .populate('closeUser').then(fixes => {
        if(fixes) {
          for (var fix of fixes) {
            if(fix.status == 'done' && fix.closeUser==null){
              fix['closeUser'] = {_id:'admin', name:'admin', username:'admin'}
          }

            res.status(200).json({
                message: "success",
                data: fixes
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
  Fix.findOne({_id: req.params.id})
  .populate('maintainer')
  .populate('instrument')
  .populate('openUser')
  .populate('closeUser').then(fix => {
      if(fix) {
          res.status(200).json({
              message: "success",
              data: fix
          });
      }
      else {
          res.status(404).json({
            message: "failed"
          })
      }
  })
});

router.post("/endFix/:id", (req, res, next)=>{
  var datetime = new Date();
  const fix =  new Fix({
    _id: req.params.id,
    closeUser: req.headers.user_id,
    to: datetime.toISOString().slice(0,10),
    status: 'done'
  });
  Fix.findOneAndUpdate({_id: req.params.id},fix).then(result => {
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
      status: "returned from maintainer",
      notes: ""
    });
    history_rec.save();
    Instrument.updateOne({_id: result.instrument}, instrument1, function(err, res) {
        if(err) console.log(err);
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

  let subtype = discreteFields[2];
  let type = discreteFields[1];
  let status = discreteFields[0];

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

  Fix.find(map2).populate({path: 'instrument',
  match: map}).populate('maintainer').populate('openUser').populate('closeUser').then(fixes => {
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
        res.status(200).json({
          message: "success",
          data: k
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "failed"
        });
   });

});

module.exports = router;

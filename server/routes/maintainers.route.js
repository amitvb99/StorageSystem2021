const express = require("express");
const Maintainer = require("../models/maintainer.model");
const Instrument = require("../models/instrument.model");
const checkAuth= require("../middleware/check-auth");
const multer= require("multer");
const csv = require('csvtojson');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { Console } = require("console");

const router = express.Router();

router.post("/create", (req, res, next) => {
    console.log(req.body.maintainerPhone)
    const maintainer = new Maintainer({
        maintainerName: req.body.maintainerName,
        maintainerPhone: req.body.maintainerPhone,
        maintainerAddress: req.body.maintainerAddress,
    });
    maintainer.save()
    .then(result => {
      res.status(201).json({
        message: "success",
        data: student._id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "failed"
      });
    });
});

router.get("", (req, res, next)=>{
    // console.log(req.headers.user_id)
    Maintainer.find()
      .then(maintainers =>{
        if(!maintainers){
          res.status(500).json({});
        }
        return maintainers;
      })
      .then(maintainers => {
        return res.status(200).json({
          message: "success",
          data: maintainers
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "failed"
        });
      });
});

router.put("/:id", (req, res, next)=>{
    console.log(req.body.maintainerName)
  
    const maintainer = new Maintainer({
        _id: req.params.id,
        maintainerName: req.body.maintainerName,
        maintainerPhone: req.body.maintainerPhone,
        maintainerAddress: req.body.maintainerAddress,
    });
  
      Maintainer.updateOne({ _id: req.params.id },maintainer).then(t => {
        res.status(200).json({
          message: "success",
          data: req.params._id
      });
      })
      .catch(err=>{
        res.status(500).json({
          message: "failed"
        });
      });
  });

  //TODO: get(/:id)

router.delete("/:id", (req, res, next)=>{
Maintainer.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({
        message: "success",
        data: req.params._id
    });
    })
.catch(err => {
    res.status(500).json({
    message: "failed"
    });
});

});

  //TODO: check if it's ok to implemet as a Loan
router.post("/sendInstrumentToMaintainer", (req, res, next)=>{
    Instrument.findOne({_id: req.body.instrument})
    .then(result => {
        if(result.status === "broken") {
            var datetime = new Date();
            const loan = new Loan({
                student: req.body.maintainer,
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
                    status: "in maintenence"
                  });
                  var datetime = new Date();
                  const history_rec = new History({
                    instrument: req.body.instrument,
                    date: datetime.toISOString().slice(0,10),
                    user: req.body.user,
                    status: "in maintenence",
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

router.post("/returnFromMaintainer/:id", (req, res, next)=>{
    const loan =  new Loan({
      _id: req.params.id,
      closeUser: req.headers.user_id,
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
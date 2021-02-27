const express = require("express");
const Loan = require("../models/loan.model")
const Instrument = require("../models/instrument.model")
const checkAuth= require("../middleware/check-auth");

const router = express.Router();

router.post("/loanInstrument", (req, res, next)=>{
  console.log('################')
  console.log(req.body)
  
    Instrument.findOne({_id: req.body.instrument})
    .then(result => {
      console.log(result)
        if(result.status === "in stock") {
            const loan = new Loan({
                student: req.body.student,
                instrument: req.body.instrument,
                openUser: req.body.user,
                from: req.body.from,
                notes: req.body.notes,
                status: req.body.status
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

router.get("",checkAuth, (req, res, next)=>{
    Loan.find().then(loans => {
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
    status: req.body.status
  });
  Loan.updateOne({_id: req.params.id},loan).then(result => {
    res.status(200).json({
      message: "success",
      data: req.params.id
    });
    const instrument1 = new Instrument({
      _id: req.body.instrument,
      status: "available"
    });
    Instrument.updateOne({_id: req.body.instrument}, instrument1, function(err, res) {
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

module.exports = router;

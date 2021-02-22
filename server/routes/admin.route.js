const express = require("express");
const User = require("../models/user.model");

const router = express.Router();


// router.post('/clear',(req,res)=>{
//   mongoose.connection.db.dropDatabase();
//   mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
//   .then(()=>{
//     console.log('Connected to database!')
//   }).catch(()=>{
//     console.log('Connectino failed!')
//   });
//   const user = new User({name: req.body.name, username: req.body.user, password: req.body.pass});
//     user
//       .save()
//       .then(result => {
//         res.status(201).json({
//           message: "User created!",
//         });
//       })
//       .catch(err => {
//         res.status(500).json({
//         });
//       });
// })


router.post("/registerUser", (req, res, next)=>{

});

router.post("/promoteUser", (req, res, next)=>{

});
module.exports = router;

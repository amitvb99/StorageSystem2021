// const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");


// const userSchema = mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// userSchema.plugin(uniqueValidator);


  // function findOne(email){
  //   return {email:"mhm", password:"123", _id:"1" };
  // }





module.exports.findOne = function findOne(email){
  return {email:"mhm", password:"123", _id:"1" };
}

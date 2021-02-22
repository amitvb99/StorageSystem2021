const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { stringifyConfiguration } = require("tslint/lib/configuration");


const studentSchema = mongoose.Schema({
  fName:  {type: String, required: true},
  lName:  {type: String, required: true},
  school: {type: String, required: true},
  grade: {type: String, required: true},
  class: {type: String, required: true},
  // id: {type: String, required: true, unique: true},
  parent1Name:  {type: String},
  parent2Name:  {type: String},
  parent1PhoneNumber: {type: String},
  parent2PhoneNumber: {type: String},
  parent1Email: {type: String},
  parent2Email: {type: String}
});


studentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Student", studentSchema);

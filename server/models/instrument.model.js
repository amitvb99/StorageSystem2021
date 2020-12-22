const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { stringifyConfiguration } = require("tslint/lib/configuration");


const instrumentSchema = mongoose.Schema({
  generalSerialNumber:  {type: String, required: true, unique: true},
  type:  {type: String, required: true},
  sub_type: {type: String, required: true},
  company: {type: String, required: true},
  model: {type: String, required: true},
  imprentedSerialNumber: {type: String, required: true, unique: true},
  ownership: {type: String, required: true},
  status: {type: String, required: true}

});


instrumentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Instrument", instrumentSchema);

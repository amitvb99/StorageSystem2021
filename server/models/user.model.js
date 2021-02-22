const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { stringifyConfiguration } = require("tslint/lib/configuration");


const userSchema = mongoose.Schema({
  name:  {type: String, required: true},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  privilege: {type: String, required:true}
});

userSchema.plugin(uniqueValidator);




module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
 url:String,
 createdAt:{
  type:Date,
  default:Date.now,
  expires:45
 }
});

module.exports = mongoose.model("Image", imageSchema);
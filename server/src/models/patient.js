const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref:"User"
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  contact:{
    type:String
  }
});


module.exports=mongoose.model("Patient",patientSchema)
const mongoose = require("mongoose")

const StudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  parentName: String,
  parentContact: String,
  bloodGroup: String,
  admissionDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Student", StudentSchema)

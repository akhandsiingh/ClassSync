const mongoose = require("mongoose")

const TeacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  qualification: String,
  specialization: String,
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
})

module.exports = mongoose.model("Teacher", TeacherSchema)

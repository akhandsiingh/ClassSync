const mongoose = require("mongoose")

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
})

module.exports = mongoose.model("Class", ClassSchema)

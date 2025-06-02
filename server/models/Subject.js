const mongoose = require("mongoose")

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: String,
  credits: {
    type: Number,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
})

module.exports = mongoose.model("Subject", SubjectSchema)

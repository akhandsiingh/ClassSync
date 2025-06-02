const mongoose = require("mongoose")

const MarkSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  examType: {
    type: String,
    enum: ["quiz", "midterm", "final", "assignment", "project", "other"],
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  grade: String,
  remarks: String,
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Mark", MarkSchema)

const mongoose = require("mongoose")

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused"],
    required: true,
  },
  remarks: String,
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to ensure a student can't have multiple attendance records for the same subject on the same day
AttendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true })

module.exports = mongoose.model("Attendance", AttendanceSchema)

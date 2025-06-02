const express = require("express")
const { auth, teacherAuth } = require("../middleware/auth")
const Attendance = require("../models/Attendance")
const Student = require("../models/Student")

const router = express.Router()

// @route   GET api/attendance/student/:studentId
// @desc    Get attendance by student ID
// @access  Private
router.get("/student/:studentId", auth, async (req, res) => {
  try {
    // Students can only access their own attendance
    if (req.user.role === "student") {
      const student = await Student.findOne({ userId: req.user.id })
      if (!student || student._id.toString() !== req.params.studentId) {
        return res.status(403).json({ msg: "Not authorized" })
      }
    }

    const attendance = await Attendance.find({ student: req.params.studentId })
      .populate("subject", "name code")
      .populate("class", "name section")
      .sort({ date: -1 })

    res.json(attendance)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/attendance/class/:classId
// @desc    Get attendance by class ID
// @access  Private/Teacher
router.get("/class/:classId", teacherAuth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ class: req.params.classId })
      .populate("student", "registrationNumber")
      .populate({
        path: "student",
        populate: {
          path: "userId",
          select: "firstName lastName",
        },
      })
      .populate("subject", "name code")
      .sort({ date: -1 })

    res.json(attendance)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/attendance
// @desc    Add a new attendance record
// @access  Private/Teacher
router.post("/", teacherAuth, async (req, res) => {
  const { student, class: classId, subject, date, status, remarks } = req.body

  try {
    // Check if attendance record already exists for this student, subject, and date
    const existingAttendance = await Attendance.findOne({
      student,
      subject,
      date: new Date(date),
    })

    if (existingAttendance) {
      return res.status(400).json({
        msg: "Attendance record already exists for this student, subject, and date",
      })
    }

    const newAttendance = new Attendance({
      student,
      class: classId,
      subject,
      date: new Date(date),
      status,
      remarks,
      markedBy: req.user.id,
    })

    const attendance = await newAttendance.save()
    res.json(attendance)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/attendance/bulk
// @desc    Add bulk attendance records
// @access  Private/Teacher
router.post("/bulk", teacherAuth, async (req, res) => {
  const { records } = req.body

  try {
    const attendanceRecords = records.map((record) => ({
      ...record,
      markedBy: req.user.id,
      date: new Date(record.date),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }))

    const attendance = await Attendance.insertMany(attendanceRecords)
    res.json(attendance)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/attendance/:id
// @desc    Update an attendance record
// @access  Private/Teacher
router.put("/:id", teacherAuth, async (req, res) => {
  try {
    let attendance = await Attendance.findById(req.params.id)
    if (!attendance) {
      return res.status(404).json({ msg: "Attendance record not found" })
    }

    // Update the attendance record
    req.body.updatedAt = Date.now()

    attendance = await Attendance.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

    res.json(attendance)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/attendance/:id
// @desc    Delete an attendance record
// @access  Private/Teacher
router.delete("/:id", teacherAuth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
    if (!attendance) {
      return res.status(404).json({ msg: "Attendance record not found" })
    }

    await Attendance.findByIdAndDelete(req.params.id)
    res.json({ msg: "Attendance record removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

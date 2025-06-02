const express = require("express")
const { auth, teacherAuth } = require("../middleware/auth")
const Student = require("../models/Student")
const User = require("../models/User")
const Mark = require("../models/Mark")
const Attendance = require("../models/Attendance")

const router = express.Router()

// @route   GET api/students
// @desc    Get all students (for teachers)
// @access  Private/Teacher
router.get("/", teacherAuth, async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", ["firstName", "lastName", "email"])
      .populate("classId", ["name", "section"])
    res.json(students)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/students/class/:classId
// @desc    Get students by class
// @access  Private/Teacher
router.get("/class/:classId", teacherAuth, async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId })
      .populate("userId", ["firstName", "lastName", "email"])
      .populate("classId", ["name", "section"])
    res.json(students)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/students/profile/me
// @desc    Get current student's profile
// @access  Private/Student
router.get("/profile/me", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ msg: "Not authorized" })
    }

    const student = await Student.findOne({ userId: req.user.id })
      .populate("userId", ["firstName", "lastName", "email"])
      .populate("classId", ["name", "section"])

    if (!student) {
      return res.status(404).json({ msg: "Student profile not found" })
    }

    res.json(student)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/students
// @desc    Create a student
// @access  Private/Teacher
router.post("/", teacherAuth, async (req, res) => {
  const {
    userId,
    registrationNumber,
    classId,
    dateOfBirth,
    gender,
    address,
    phoneNumber,
    parentName,
    parentContact,
    bloodGroup,
  } = req.body

  try {
    // Check if user exists and is a student
    const user = await User.findById(userId)
    if (!user || user.role !== "student") {
      return res.status(400).json({ msg: "Invalid user or user is not a student" })
    }

    // Check if student already exists
    let student = await Student.findOne({ userId })
    if (student) {
      return res.status(400).json({ msg: "Student already exists" })
    }

    // Create new student
    student = new Student({
      userId,
      registrationNumber,
      classId,
      dateOfBirth,
      gender,
      address,
      phoneNumber,
      parentName,
      parentContact,
      bloodGroup,
    })

    await student.save()
    res.json(student)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/students/:id
// @desc    Update a student
// @access  Private/Teacher
router.put("/:id", teacherAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ msg: "Student not found" })
    }

    // Update fields
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .populate("userId", ["firstName", "lastName", "email"])
      .populate("classId", ["name", "section"])

    res.json(updatedStudent)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/students/:id
// @desc    Delete a student
// @access  Private/Teacher
router.delete("/:id", teacherAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ msg: "Student not found" })
    }

    // Delete student's marks and attendance records
    await Mark.deleteMany({ student: req.params.id })
    await Attendance.deleteMany({ student: req.params.id })

    // Delete student
    await Student.findByIdAndDelete(req.params.id)

    res.json({ msg: "Student removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

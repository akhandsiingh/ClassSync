const express = require("express")
const { auth, teacherAuth } = require("../middleware/auth")
const Teacher = require("../models/Teacher")
const User = require("../models/User")

const router = express.Router()

// @route   GET api/teachers
// @desc    Get all teachers
// @access  Private/Teacher
router.get("/", teacherAuth, async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", ["firstName", "lastName", "email"])
      .populate("classes", ["name", "section"])
      .populate("subjects", ["name", "code"])
    res.json(teachers)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/teachers/profile/me
// @desc    Get current teacher's profile
// @access  Private/Teacher
router.get("/profile/me", auth, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Not authorized" })
    }

    const teacher = await Teacher.findOne({ userId: req.user.id })
      .populate("userId", ["firstName", "lastName", "email"])
      .populate("classes", ["name", "section"])
      .populate("subjects", ["name", "code"])

    if (!teacher) {
      return res.status(404).json({ msg: "Teacher profile not found" })
    }

    res.json(teacher)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/teachers
// @desc    Create a teacher
// @access  Private/Teacher
router.post("/", teacherAuth, async (req, res) => {
  const { userId, employeeId, qualification, specialization, phoneNumber, address } = req.body

  try {
    // Check if user exists and is a teacher
    const user = await User.findById(userId)
    if (!user || user.role !== "teacher") {
      return res.status(400).json({ msg: "Invalid user or user is not a teacher" })
    }

    // Check if teacher already exists
    let teacher = await Teacher.findOne({ userId })
    if (teacher) {
      return res.status(400).json({ msg: "Teacher already exists" })
    }

    // Create new teacher
    teacher = new Teacher({
      userId,
      employeeId,
      qualification,
      specialization,
      phoneNumber,
      address,
    })

    await teacher.save()
    res.json(teacher)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

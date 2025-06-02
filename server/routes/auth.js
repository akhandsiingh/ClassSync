const express = require("express")
const jwt = require("jsonwebtoken")
const { auth } = require("../middleware/auth")
const User = require("../models/User")
const Student = require("../models/Student")
const Teacher = require("../models/Teacher")

const router = express.Router()

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if user exists
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err
      res.json({ token, role: user.role })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/auth/student-signup
// @desc    Register a student with user account
// @access  Public
router.post("/student-signup", async (req, res) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    registrationNumber,
    classId,
    dateOfBirth,
    gender,
    phoneNumber,
    parentName,
    parentContact,
    bloodGroup,
    address,
  } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ username }, { email }] })
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    // Check if registration number already exists
    const existingStudent = await Student.findOne({ registrationNumber })
    if (existingStudent) {
      return res.status(400).json({ msg: "Registration number already exists" })
    }

    // Create new user
    user = new User({
      username,
      password,
      role: "student",
      email,
      firstName,
      lastName,
    })

    await user.save()

    // Create student profile
    const student = new Student({
      userId: user._id,
      registrationNumber,
      classId,
      dateOfBirth,
      gender,
      phoneNumber,
      parentName,
      parentContact,
      bloodGroup,
      address,
    })

    await student.save()

    res.json({ msg: "Student registration successful" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/auth/teacher-signup
// @desc    Register a teacher with user account
// @access  Public
router.post("/teacher-signup", async (req, res) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    employeeId,
    qualification,
    specialization,
    phoneNumber,
    address,
  } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ username }, { email }] })
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    // Check if employee ID already exists
    const existingTeacher = await Teacher.findOne({ employeeId })
    if (existingTeacher) {
      return res.status(400).json({ msg: "Employee ID already exists" })
    }

    // Create new user
    user = new User({
      username,
      password,
      role: "teacher",
      email,
      firstName,
      lastName,
    })

    await user.save()

    // Create teacher profile
    const teacher = new Teacher({
      userId: user._id,
      employeeId,
      qualification,
      specialization,
      phoneNumber,
      address,
    })

    await teacher.save()

    res.json({ msg: "Teacher registration successful" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

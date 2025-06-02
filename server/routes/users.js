const express = require("express")
const User = require("../models/User")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// @route   POST api/users
// @desc    Register a user
// @access  Private/Admin
router.post("/", adminAuth, async (req, res) => {
  const { username, password, role, email, firstName, lastName } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ username }, { email }] })
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    // Create new user
    user = new User({
      username,
      password,
      role,
      email,
      firstName,
      lastName,
    })

    await user.save()

    res.json({ msg: "User created successfully", userId: user._id })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

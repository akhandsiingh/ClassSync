const express = require("express")
const { teacherAuth } = require("../middleware/auth")
const Subject = require("../models/Subject")

const router = express.Router()

// @route   GET api/subjects
// @desc    Get all subjects
// @access  Private/Teacher
router.get("/", teacherAuth, async (req, res) => {
  try {
    const subjects = await Subject.find().populate("teacher", "firstName lastName").populate("classes", "name section")
    res.json(subjects)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/subjects/:id
// @desc    Get subject by ID
// @access  Private/Teacher
router.get("/:id", teacherAuth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("teacher", "firstName lastName")
      .populate("classes", "name section")

    if (!subject) {
      return res.status(404).json({ msg: "Subject not found" })
    }

    res.json(subject)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/subjects
// @desc    Create a subject
// @access  Private/Teacher
router.post("/", teacherAuth, async (req, res) => {
  const { name, code, description, credits, teacher } = req.body

  try {
    const newSubject = new Subject({
      name,
      code,
      description,
      credits,
      teacher,
    })

    const subject = await newSubject.save()
    res.json(subject)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/subjects/:id
// @desc    Update a subject
// @access  Private/Teacher
router.put("/:id", teacherAuth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      return res.status(404).json({ msg: "Subject not found" })
    }

    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

    res.json(updatedSubject)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/subjects/:id
// @desc    Delete a subject
// @access  Private/Teacher
router.delete("/:id", teacherAuth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      return res.status(404).json({ msg: "Subject not found" })
    }

    await Subject.findByIdAndDelete(req.params.id)
    res.json({ msg: "Subject removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

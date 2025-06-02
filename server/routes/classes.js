const express = require("express")
const { teacherAuth } = require("../middleware/auth")
const Class = require("../models/Class")

const router = express.Router()

// @route   GET api/classes/public
// @desc    Get all classes for public signup
// @access  Public
router.get("/public", async (req, res) => {
  try {
    const classes = await Class.find().select("name section academicYear")
    res.json(classes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/classes
// @desc    Get all classes
// @access  Private/Teacher
router.get("/", teacherAuth, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("classTeacher", "firstName lastName")
      .populate("students", "registrationNumber")
      .populate("subjects", "name code")
    res.json(classes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/classes/:id
// @desc    Get class by ID
// @access  Private/Teacher
router.get("/:id", teacherAuth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("classTeacher", "firstName lastName")
      .populate({
        path: "students",
        populate: {
          path: "userId",
          select: "firstName lastName",
        },
      })
      .populate("subjects", "name code")

    if (!classData) {
      return res.status(404).json({ msg: "Class not found" })
    }

    res.json(classData)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/classes
// @desc    Create a class
// @access  Private/Teacher
router.post("/", teacherAuth, async (req, res) => {
  const { name, section, academicYear, classTeacher } = req.body

  try {
    const newClass = new Class({
      name,
      section,
      academicYear,
      classTeacher,
    })

    const classData = await newClass.save()
    res.json(classData)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/classes/:id
// @desc    Update a class
// @access  Private/Teacher
router.put("/:id", teacherAuth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
    if (!classData) {
      return res.status(404).json({ msg: "Class not found" })
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

    res.json(updatedClass)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/classes/:id
// @desc    Delete a class
// @access  Private/Teacher
router.delete("/:id", teacherAuth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
    if (!classData) {
      return res.status(404).json({ msg: "Class not found" })
    }

    await Class.findByIdAndDelete(req.params.id)
    res.json({ msg: "Class removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

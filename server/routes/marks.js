const express = require("express")
const { auth, teacherAuth } = require("../middleware/auth")
const Mark = require("../models/Mark")
const Student = require("../models/Student")

const router = express.Router()

// @route   GET api/marks/student/:studentId
// @desc    Get marks by student ID
// @access  Private
router.get("/student/:studentId", auth, async (req, res) => {
  try {
    // Students can only access their own marks
    if (req.user.role === "student") {
      const student = await Student.findOne({ userId: req.user.id })
      if (!student || student._id.toString() !== req.params.studentId) {
        return res.status(403).json({ msg: "Not authorized" })
      }
    }

    const marks = await Mark.find({ student: req.params.studentId })
      .populate("subject", "name code")
      .populate("class", "name section")
      .sort({ date: -1 })

    res.json(marks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/marks/class/:classId
// @desc    Get marks by class ID
// @access  Private/Teacher
router.get("/class/:classId", teacherAuth, async (req, res) => {
  try {
    const marks = await Mark.find({ class: req.params.classId })
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

    res.json(marks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/marks
// @desc    Add a new mark
// @access  Private/Teacher
router.post("/", teacherAuth, async (req, res) => {
  const { student, subject, class: classId, examType, marks, totalMarks, remarks } = req.body

  try {
    // Calculate percentage and grade
    const percentage = (marks / totalMarks) * 100
    let grade = ""

    if (percentage >= 90) grade = "A+"
    else if (percentage >= 80) grade = "A"
    else if (percentage >= 70) grade = "B"
    else if (percentage >= 60) grade = "C"
    else if (percentage >= 50) grade = "D"
    else grade = "F"

    const newMark = new Mark({
      student,
      subject,
      class: classId,
      examType,
      marks,
      totalMarks,
      percentage,
      grade,
      remarks,
      createdBy: req.user.id,
    })

    const mark = await newMark.save()
    res.json(mark)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/marks/:id
// @desc    Update a mark
// @access  Private/Teacher
router.put("/:id", teacherAuth, async (req, res) => {
  try {
    let mark = await Mark.findById(req.params.id)
    if (!mark) {
      return res.status(404).json({ msg: "Mark not found" })
    }

    // If marks or totalMarks are being updated, recalculate percentage and grade
    if (req.body.marks !== undefined && req.body.totalMarks !== undefined) {
      const percentage = (req.body.marks / req.body.totalMarks) * 100
      let grade = ""

      if (percentage >= 90) grade = "A+"
      else if (percentage >= 80) grade = "A"
      else if (percentage >= 70) grade = "B"
      else if (percentage >= 60) grade = "C"
      else if (percentage >= 50) grade = "D"
      else grade = "F"

      req.body.percentage = percentage
      req.body.grade = grade
    }

    // Update the mark
    req.body.updatedAt = Date.now()

    mark = await Mark.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

    res.json(mark)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/marks/:id
// @desc    Delete a mark
// @access  Private/Teacher
router.delete("/:id", teacherAuth, async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id)
    if (!mark) {
      return res.status(404).json({ msg: "Mark not found" })
    }

    await Mark.findByIdAndDelete(req.params.id)
    res.json({ msg: "Mark removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

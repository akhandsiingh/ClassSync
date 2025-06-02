const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const studentRoutes = require("./routes/students")
const teacherRoutes = require("./routes/teachers")
const classRoutes = require("./routes/classes")
const subjectRoutes = require("./routes/subjects")
const markRoutes = require("./routes/marks")
const attendanceRoutes = require("./routes/attendance")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json({ extended: false }))
app.use(cors())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

// Define Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/teachers", teacherRoutes)
app.use("/api/classes", classRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/marks", markRoutes)
app.use("/api/attendance", attendanceRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
  })
}

app.listen(PORT, () => console.log(`ClassSync Server started on port ${PORT}`))

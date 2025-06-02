import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/routing/PrivateRoute"
import TeacherRoute from "./components/routing/TeacherRoute"

// Layout Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Sidebar from "./components/layout/Sidebar"
import Alert from "./components/layout/Alert"

// Auth Components
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import StudentSignup from "./components/auth/StudentSignup"
import TeacherSignup from "./components/auth/TeacherSignup"

// Dashboard Components
import Dashboard from "./components/dashboard/Dashboard"

// Student Components
import Students from "./components/students/Students"
import StudentDetail from "./components/students/StudentDetail"
import StudentForm from "./components/students/StudentForm"
import StudentProfile from "./components/students/StudentProfile"

// Class Components
import Classes from "./components/classes/Classes"
import ClassDetail from "./components/classes/ClassDetail"
import ClassForm from "./components/classes/ClassForm"

// Subject Components
import Subjects from "./components/subjects/Subjects"
import SubjectDetail from "./components/subjects/SubjectDetail"
import SubjectForm from "./components/subjects/SubjectForm"

// Mark Components
import Marks from "./components/marks/Marks"
import MarksByClass from "./components/marks/MarksByClass"
import MarksBySubject from "./components/marks/MarksBySubject"
import MarkForm from "./components/marks/MarkForm"
import StudentMarks from "./components/marks/StudentMarks"

// Attendance Components
import Attendance from "./components/attendance/Attendance"
import AttendanceByClass from "./components/attendance/AttendanceByClass"
import AttendanceBySubject from "./components/attendance/AttendanceBySubject"
import AttendanceForm from "./components/attendance/AttendanceForm"
import StudentAttendance from "./components/attendance/StudentAttendance"

// User Components
import Users from "./components/users/Users"
import UserForm from "./components/users/UserForm"

import "./App.css"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Sidebar />
            <div className="content-area">
              <Alert />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/student-signup" element={<StudentSignup />} />
                <Route path="/teacher-signup" element={<TeacherSignup />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<StudentProfile />} />
                  <Route path="/student/marks" element={<StudentMarks />} />
                  <Route path="/student/attendance" element={<StudentAttendance />} />
                </Route>

                <Route element={<TeacherRoute />}>
                  <Route path="/students" element={<Students />} />
                  <Route path="/students/:id" element={<StudentDetail />} />
                  <Route path="/students/add" element={<StudentForm />} />
                  <Route path="/students/edit/:id" element={<StudentForm />} />

                  <Route path="/classes" element={<Classes />} />
                  <Route path="/classes/:id" element={<ClassDetail />} />
                  <Route path="/classes/add" element={<ClassForm />} />
                  <Route path="/classes/edit/:id" element={<ClassForm />} />

                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/subjects/:id" element={<SubjectDetail />} />
                  <Route path="/subjects/add" element={<SubjectForm />} />
                  <Route path="/subjects/edit/:id" element={<SubjectForm />} />

                  <Route path="/marks" element={<Marks />} />
                  <Route path="/marks/class/:classId" element={<MarksByClass />} />
                  <Route path="/marks/subject/:subjectId" element={<MarksBySubject />} />
                  <Route path="/marks/add" element={<MarkForm />} />
                  <Route path="/marks/edit/:id" element={<MarkForm />} />

                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/attendance/class/:classId" element={<AttendanceByClass />} />
                  <Route path="/attendance/subject/:subjectId" element={<AttendanceBySubject />} />
                  <Route path="/attendance/add" element={<AttendanceForm />} />
                  <Route path="/attendance/edit/:id" element={<AttendanceForm />} />

                  <Route path="/users" element={<Users />} />
                  <Route path="/users/add" element={<UserForm />} />
                  <Route path="/users/edit/:id" element={<UserForm />} />
                </Route>
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

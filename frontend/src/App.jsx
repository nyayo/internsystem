import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/auth/register/RegisterPage";
import LoginPage from "./pages/auth/login/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import Pending from "./pages/admin/Pending";
import Supervisors from "./pages/admin/Supervisors";
import StudentDashboard from "./pages/student/studentDashboard";
import './App.css';

function App() {
  return (
    // <Routes>
    //   <Route path="/register" element={<RegisterPage />} />
    //   <Route path="/login" element={<LoginPage />} />
    //   <Route path="/student" element={<StudentDashboard />} />
    //   <Route path="/admin" element={<AdminDashboard />} />
    //   <Route path="/admin/students" element={<Students />} />
    //   <Route path="/admin/pending" element={<Pending />} />
    //   <Route path="/admin/supervisors" element={<Supervisors />} />
    //   <Route path="/" element={<StudentDashboard />} />
    // </Routes>
    <AdminDashboard />
  );
}

export default App;



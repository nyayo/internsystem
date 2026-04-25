import { Route, Routes } from "react-router-dom";
import Notification from "./components/Notification";
import {
  DefaultRedirect,
  PublicOnlyRoute,
  RoleRoute,
} from "./components/auth/RouteGuards";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import Dashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import AcademicDashboard from "./pages/supervisor/academic/AcademicDashboard";
import WorkplaceDashboard from "./pages/supervisor/workplace/WorkplaceDashboard";

function App() {
  return (
    <>
      {/* <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/student"
          element={
            <RoleRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/supervisor/workplace"
          element={
            <RoleRoute allowedRoles={["workplace_supervisor"]}>
              <WorkplaceDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/supervisor/academic"
          element={
            <RoleRoute allowedRoles={["academic_supervisor"]}>
              <AcademicDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Dashboard />
            </RoleRoute>
          }
        />
        <Route path="/" element={<DefaultRedirect />} />
        <Route path="*" element={<DefaultRedirect />} />
      </Routes> */}
      <Dashboard />
      <Notification />
    </>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import Notification from "./components/Notification";
import {
  DefaultRedirect,
  PublicOnlyRoute,
  RoleRoute,
} from "./components/auth/RouteGuards";
import LoginPage from "./pages/auth/login/LoginPage";
import CheckEmailPage from "./pages/auth/verify/CheckEmailPage";
import VerifyEmailPage from "./pages/auth/verify/VerifyEmailPage";
import EmailConfirmedPage from "./pages/auth/verify/EmailConfirmedPage";
// import WorkplaceDashboard from "./pages/supervisor/WorkplaceDashboard";
// import AcademicDashboard from "./pages/supervisor/AcademicDashboard";
import RegisterPage from "./pages/auth/register/RegisterPage";
import Dashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";


function App() {
  return (
    <>
      <Routes>
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
          path="/register/check-email"
          element={
            <PublicOnlyRoute>
              <CheckEmailPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/email-confirmed"
          element={
            <PublicOnlyRoute>
              <EmailConfirmedPage />
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
        {/* <Route
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
        /> */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["internship_administrator"]}>
              <Dashboard />
            </RoleRoute>
          }
        />
        <Route path="/" element={<DefaultRedirect />} />
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
      {/* <Dashboard /> */}
      {/* <StudentDashboard /> */}
      <Notification />
    </>
  );
}

export default App;

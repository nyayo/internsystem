import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  DefaultRedirect,
  PublicOnlyRoute,
  RoleRoute,
} from "./components/auth/RouteGuards";
import LoginPage from "./pages/auth/login/LoginPage";
import CheckEmailPage from "./pages/auth/verify/CheckEmailPage";
import VerifyEmailPage from "./pages/auth/verify/VerifyEmailPage";
import EmailConfirmedPage from "./pages/auth/verify/EmailConfirmedPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import ForgotPasswordPage from "./pages/auth/password/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/password/ResetPasswordPage";
import Dashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import AcademicDashboard from "./pages/supervisor/academic/AcademicDashboard";
import WorkplaceDashboard from "./pages/supervisor/workplace/WorkplaceDashboard";


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
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPasswordPage />
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
      {/* <WorkplaceDashboard /> */}
      {/* <AcademicDashboard /> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;

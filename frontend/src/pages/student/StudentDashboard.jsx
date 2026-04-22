import {
  currentStudent,
  studentPlacement,
  studentWeeklyLogs,
  calculateInternshipProgress,
  getCurrentWeekNumber,
  getTotalWeeks,
} from "../../data/studentDashboardData";

// import StudentCard from "../../components/StudentCard";
// import PlacementCard from "../../components/PlacementCard";
// import ProgressCard from "../../components/ProgressCard";
// import WeeklyLogs from "../../components/WeeklyLogs";
// import QuickActions from "../../components/QuickActions";
import StudentSideBar from "../../components/student/StudentSideBar";
import StudentRightPanel from "../../components/student/StudentRightPanel";


const StudentDashboard = () => {
//   const progress = studentPlacement
//     ? calculateInternshipProgress(
//         studentPlacement.startDate,
//         studentPlacement.endDate
//       )
//     : 0;

//   const currentWeek = studentPlacement
//     ? getCurrentWeekNumber(studentPlacement.startDate)
//     : 0;

//   const totalWeeks = studentPlacement
//     ? getTotalWeeks(
//         studentPlacement.startDate,
//         studentPlacement.endDate
//       )
//     : 0;

  return (
    <div className="student-dashboard">
      <StudentSideBar />
      <StudentRightPanel student={currentStudent} />
    </div>
  );
};

export default StudentDashboard;
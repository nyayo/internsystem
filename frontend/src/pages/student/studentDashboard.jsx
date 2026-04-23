import {
  currentStudent,
  studentPlacement,
  studentWeeklyLogs,
  calculateInternshipProgress,
  getCurrentWeekNumber,
  getTotalWeeks,
} from "../../data/studentDashboardData";

import StudentCard from "../../components/StudentCard";
import PlacementCard from "../../components/PlacementCard";
import ProgressCard from "../../components/ProgressCard";
import WeeklyLogs from "../../components/WeeklyLogs";
import QuickActions from "../../components/QuickActions";

const StudentDashboard = () => {
  const progress = studentPlacement
    ? calculateInternshipProgress(
        studentPlacement.startDate,
        studentPlacement.endDate
      )
    : 0;

  const currentWeek = studentPlacement
    ? getCurrentWeekNumber(studentPlacement.startDate)
    : 0;

  const totalWeeks = studentPlacement
    ? getTotalWeeks(
        studentPlacement.startDate,
        studentPlacement.endDate
      )
    : 0;

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>

      <div className="grid">
        <StudentCard student={currentStudent} />
        <PlacementCard placement={studentPlacement} />
        <ProgressCard
          progress={progress}
          currentWeek={currentWeek}
          totalWeeks={totalWeeks}
        />
        <WeeklyLogs logs={studentWeeklyLogs} />
        <QuickActions />
      </div>
    </div>
  );
};

export default StudentDashboard;
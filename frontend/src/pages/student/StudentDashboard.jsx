import {
  currentStudent,
  studentPlacement,
  studentWeeklyLogs,
  //calculateInternshipProgress,
  //getCurrentWeekNumber,
 // getTotalWeeks,
} from "../../data/studentDashboardData";

// import StudentCard from "../../components/StudentCard";
// import PlacementCard from "../../components/PlacementCard";
// import ProgressCard from "../../components/ProgressCard";
// import WeeklyLogs from "../../components/WeeklyLogs";
// import QuickActions from "../../components/QuickActions";
import StudentSideBar from "../../components/student/StudentSideBar";
import StudentRightPanel from "../../components/student/StudentRightPanel";
import CalendarWidget from "../../components/student/CalendarWidget";
import ProgressTracker from "../../components/student/ProgressTracker";
import StudentMainPanel from '../../components/student/StudentMainPanel';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <StudentSideBar />
      <StudentRightPanel student={currentStudent} />
      <div className="calendar-container">
        <CalendarWidget startDate={studentPlacement?.startDate} endDate={studentPlacement?.endDate} />
      </div>
      <ProgressTracker />
      <ProgressTracker placement={studentPlacement} weeklyLogs={studentWeeklyLogs} />
      <div className="StudentMainPanel-container">
        <StudentMainPanel
          activeLink="dashboard"
          student={currentStudent}
          placement={studentPlacement}
          weeklyLogs={studentWeeklyLogs}
          onNewLog={() => {}}
          onEditLog={() => {}}
          onOpenPlacement={() => {}}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
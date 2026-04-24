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
import CalendarWidget from "../../components/student/CalenderWidget";
import ProgressTracker from "../../components/student/ProgressTracker";
import StudentMainPanel from '../../components/student/StudentMainPanel';

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
          <div className="WeeklyLogs-container">
            <WeeklyLogs logs={studentWeeklyLogs} />
          </div>
          <div className="QuickActions-container">
            <QuickActions />
          </div>
          <div className="ProgressCard-container">
            <ProgressCard progress={progress} currentWeek={currentWeek} totalWeeks={totalWeeks} />
          </div>
          div className="PlacementCard-container">
            <PlacementCard placement={studentPlacement} />
            <div className="StudentCard-container">
              <StudentCard student={currentStudent} />
            </div>
            <div WelcomeBanner-container">
              <WelcomeBanner student={currentStudent} placement={studentPlacement} />
            </div>
          <div CalendarWidget-container">
            <CalendarWidget startDate={studentPlacement?.startDate} endDate={studentPlacement?.endDate} />
        />
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
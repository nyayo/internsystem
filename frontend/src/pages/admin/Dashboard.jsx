import React, { useState } from "react";

import "./Dashboard.css";
import SideBar from "../../components/admin/SideBar";
import MainPanel from "../../components/admin/MainPanel";
import RightPanel from "../../components/admin/RightPanel";
import PendingApprovals from "./PendingApprovals";
import StudentsPage from "./StudentsPage";
import ActiveInternshipsPage from "./ActiveInternshipsPage";
import SupervisorsPage from "./SupervisorsPage";
import EvaluationCriteriaPage from "./EvaluationCriteriaPage";
import { useAdmin, AdminProvider } from "../../context/AdminContext";


const DashboardContent = () => {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { placements, students, criteria, applications, stats, pendingCount, workplaceSupervisors, academicSupervisors, handleUpdatePlacement, handleUpdateApplication, handleAddCriteria, handleUpdateCriteria } = useAdmin();

  // Render the appropriate main content based on activeLink
  const renderMainContent = () => {
    switch (activeLink) {
      case "pending":
        return (
          <main>
            <PendingApprovals
              placements={placements}
              onUpdatePlacement={handleUpdatePlacement}
            />
          </main>
        );
      case "students":
        return (
          <main>
            <StudentsPage students={students} />
          </main>
        );
      case "active":
        return (
          <main>
            <ActiveInternshipsPage placements={placements} />
          </main>
        );
      case "supervisors":
        return (          
          <main>
            <SupervisorsPage
              workplaceSupervisors={workplaceSupervisors}
              academicSupervisors={academicSupervisors}
            />
          </main>
        );
      case "criteria":
        return (
          <main>
            <EvaluationCriteriaPage
              criteria={criteria}
              onAddCriteria={handleAddCriteria}
              onUpdateCriteria={handleUpdateCriteria}
            />
          </main>
        );
      default:
        return (
          <>
            <MainPanel
              stats={stats}
              applications={applications}
              criteria={criteria}
              onUpdateApplication={handleUpdateApplication}
              onAddCriteria={handleAddCriteria}
              onUpdateCriteria={handleUpdateCriteria}
            />
          </>
        );
    }
  };

  return (
    <div className="container">
      <SideBar
        activeLink={activeLink}
        onLinkClick={setActiveLink}
        pendingCount={pendingCount}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />
      {renderMainContent()}
      <RightPanel onMenuClick={() => setSidebarOpen(true)} stats={stats} />
    </div>
  );
}


export default function Dashboard() {
  return (
    <AdminProvider>
      <DashboardContent />
    </AdminProvider>
  );
}

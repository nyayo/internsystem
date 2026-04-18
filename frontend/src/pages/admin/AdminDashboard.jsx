import Sidebar from "../../components/admin/Sidebar"



function AdminDashboard(){
  return(
    <div style={{display: "flex"}}>
      <Sidebar/>

      <div style={{padding: "20px", flex: 1}}>
        <h1>Admin Dashboard</h1>
        <p>Welcome Admin👋</p>

        {/* ✅ Stats*/ }
        <div style={{ display: "flex", gap: "20px", marginTop: "20px"}}>
          <div style={{ background: "#eee", padding: "15px"}}>
            Students: 120
            
          </div>
          <div style={{ background: "#eee", padding: "15px"}}>
            Pending: 8
          </div>
        </div>
        {/* Activity */}
        <div style={{ marginTop: "30px"}}>
          <h3>Recent Activity</h3>
          <ul>
            <li>New student registered</li>
            <li>Internship approved</li>
            <li>Supervisor added</li>
          </ul>
        </div>
      </div>
    </div>
    
  );
}

export default AdminDashboard
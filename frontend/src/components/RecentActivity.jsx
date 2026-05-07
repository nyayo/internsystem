export default function RecentActivity() {
     if (!activity || activity.length === 0) {
    return <p>No recent activity</p>;
  }
  return(
     <div>
        <h3>Recent Activity</h3>
      <ul>
        {activity.map((item) => (
         <li key={item.id}>
        <div>
         <strong>{item.title}</strong> - {item.studentName}
        </div>

        <div>
         {item.studentName}
         {item.organization && ` - ${item.organization}`}
      </div>

      <div>{item.action}</div>

      <small>
         {item.date
                ? new Date(item.date).toLocaleDateString()
                : "No date"}
        
      </small>
    
    </li>
  ))}
      </ul>
     </div>
  );

}
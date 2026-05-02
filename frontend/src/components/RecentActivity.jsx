export default function RecentActivity() {
  return(
     <div>
        <h3>Recent Activity</h3>
      <ul>
        {activity.map((item) => (
    <li key={item.id}>
      <strong>{item.title}</strong> - {item.studentName}
      </div>

      <div>
        {item.studentName}
        {item.organization && ` - ${item.organization}`}
      </div>

      <div>{item.action}</div>

      <small>{new Date(item.date).toLocaleDateString()}</small>
    
    </li>
  ))}
      </ul>
     </div>
  );

}
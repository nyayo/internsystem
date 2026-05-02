export default function RecentActivity() {
  return(
     <div>
        <h3>Recent Activity</h3>
      <ul>
        {activity.map((item) => (
    <li key={item.id}>
      <strong>{item.title}</strong> - {item.studentName}
    </li>
  ))}
      </ul>
     </div>
  );

}
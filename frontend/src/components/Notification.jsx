import React from 'react';
import { useNotification } from '../context/NotificationContext';
import './Notification.css';

export default function Notification() {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification ${notification.type} show`}>
      <span className="material-icons-sharp">
        {notification.type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span>{notification.message}</span>
    </div>
  );
}

import React, { useState } from 'react';
import './CalendarWidget.css';

const parseDateOnly = (value) => {
  if (!value) return null;
  const datePart = String(value).split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarWidget({ startDate, endDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const internshipStart = parseDateOnly(startDate);
  const internshipEnd = parseDateOnly(endDate);
  const startDateKey = internshipStart ? formatDateKey(internshipStart) : null;
  const endDateKey = internshipEnd ? formatDateKey(internshipEnd) : null;
  const today = new Date();
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendarData = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarData.push({ day: null, type: 'empty' });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    let type = 'normal';

    if (internshipStart && internshipEnd && date >= internshipStart && date <= internshipEnd) {
      type = 'internship';
    }

    if (dateKey === startDateKey) {
      type = 'start';
    } else if (dateKey === endDateKey) {
      type = 'end';
    }

    const isToday = date.toDateString() === today.toDateString();
    calendarData.push({ day, type, isToday, date });
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
  };
  
  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <h4>Internship Calendar</h4>
        <div className="calendar-nav">
          <button onClick={prevMonth} className="nav-btn">
            <span className="material-icons-sharp">chevron_left</span>
          </button>
          <span className="current-month">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button onClick={nextMonth} className="nav-btn">
            <span className="material-icons-sharp">chevron_right</span>
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="day-names">
          {dayNames.map(day => (
            <span key={day} className="day-name">{day}</span>
          ))}
        </div>
        
        <div className="days">
          {calendarData.map((item, index) => (
            <div 
              key={index} 
              className={`day-cell ${item.type} ${item.isToday ? 'today' : ''}`}
            >
              {item.day}
            </div>
          ))}
        </div>
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="dot start"></span>
          <span>Start</span>
        </div>
        <div className="legend-item">
          <span className="dot internship"></span>
          <span>Active</span>
        </div>
        <div className="legend-item">
          <span className="dot end"></span>
          <span>End</span>
        </div>
        <div className="legend-item">
          <span className="dot today"></span>
          <span>Today</span>
        </div>
      </div>
      
      <button className="today-btn" onClick={goToToday}>
        <span className="material-icons-sharp">today</span>
        Go to Today
      </button>
    </div>
  );
}

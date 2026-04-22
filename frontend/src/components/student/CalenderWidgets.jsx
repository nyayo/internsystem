import React, { useState } from 'react';
import './CalendarWidget.css';
export default function CalendarWidget({ startDate, endDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

   
  const internshipStart = new Date(startDate);
  const internshipEnd = new Date(endDate);
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
    const dateStr = date.toISOString().split('T')[0];
    let type = 'normal';

    if (date >= internshipStart && date <= internshipEnd) {
      type = 'internship';
    }



  
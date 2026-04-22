import React, { useState } from 'react';
import './CalendarWidget.css';
export default function CalendarWidget({ startDate, endDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

   
  const internshipStart = new Date(startDate);
  const internshipEnd = new Date(endDate);
  const today = new Date();
  
import React from 'react';
import { formatDate } from '../../data/studentDashboardData';
import './WelcomeBanner.css';

export default function WelcomeBanner({ student, placement }) {
  const hasActivePlacement = placement && ['approved', 'active', 'completed'].includes(placement.status);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  return (
    <div className="welcome-banner">
      <div className="welcome-content"></div>
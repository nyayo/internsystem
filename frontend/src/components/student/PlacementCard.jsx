import React from 'react';

const PlacementCard = ({ placement }) => {
  if (!placement) {
    return (
      <div className="placement-card">
        <h3>No Active Placement</h3>
        <p>You haven't been assigned to an internship yet.</p>
      </div>
    );
  }

  return (
    <div className="placement-card">
      <h3>{placement.organisationName}</h3>
      <p>Department: {placement.department}</p>
      <p>Supervisor: {placement.workplaceSupervisor.name}</p>
      <p>Status: {placement.status}</p>
      <p>Start: {placement.startDate}</p>
      <p>End: {placement.endDate}</p>
    </div>
  );
};

export default PlacementCard;
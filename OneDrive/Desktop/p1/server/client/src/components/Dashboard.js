import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-links">
        <Link to="/tickets">View Tickets</Link>
        <Link to="/tickets/new">Create Ticket</Link>
        <Link to="/analytics">Analytics</Link>
      </div>
      {/* TODO: Add charts and SLA breach summary */}
    </div>
  );
}

export default Dashboard;

import React from 'react';
import './Analytics.css';

function Analytics() {
  // TODO: Fetch analytics data from backend
  return (
    <div className="analytics-container">
      <h2>Analytics</h2>
      <div>
        <p>Average Resolution Time: 2 days</p>
        <p>Top Issues: Printer, Email</p>
        {/* TODO: Add charts for analytics */}
      </div>
    </div>
  );
}

export default Analytics;

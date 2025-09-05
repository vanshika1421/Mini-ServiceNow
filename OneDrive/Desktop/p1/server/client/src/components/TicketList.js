import React from 'react';
import './TicketList.css';

function TicketList() {
  // TODO: Fetch tickets from backend
  const tickets = [
    { id: 1, title: 'Printer not working', status: 'Open', priority: 'High' },
    { id: 2, title: 'Email issue', status: 'Resolved', priority: 'Medium' },
  ];

  return (
    <div className="ticket-list-container">
      <h2>Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketList;

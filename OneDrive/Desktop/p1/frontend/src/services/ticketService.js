import axios from 'axios';

const API_URL = '/api/tickets';

export const assignTicket = async (ticketId, userId, token) => {
  const res = await axios.put(`${API_URL}/${ticketId}`, { assignedTo: userId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

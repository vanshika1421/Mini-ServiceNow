export const getUsers = (token) =>
  API.get("/users", { headers: { Authorization: `Bearer ${token}` } });
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3011/api" });

export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);

export const getTickets = (token) =>
  API.get("/tickets", { headers: { Authorization: `Bearer ${token}` } });

export const createTicket = (ticketData, token) =>
  API.post("/tickets", ticketData, { headers: { Authorization: `Bearer ${token}` } });

export const updateTicket = (id, ticketData, token) =>
  API.put(`/tickets/${id}`, ticketData, { headers: { Authorization: `Bearer ${token}` } });

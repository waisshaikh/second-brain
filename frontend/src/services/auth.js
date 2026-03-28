import { api } from "../api/index.js";

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};
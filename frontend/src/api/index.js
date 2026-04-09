import axios from "axios";

export const api = axios.create({
  baseURL: "https://second-brain-huvx.onrender.com/api"|| 'http://localhost:5000/'
});

//   check token validty
const isValidToken = (token) => {
  try {
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));

    // expiry check
    if (payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

// INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  //  ONLY SEND VALID TOKEN
  if (isValidToken(token)) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(" VALID TOKEN SENT");
  } else {
    console.log(" INVALID TOKEN REMOVED");
    localStorage.removeItem("token");
  }

  return config;
});
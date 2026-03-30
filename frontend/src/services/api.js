import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 REQUEST INTERCEPTOR
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    // 🔥 DEBUG
    console.log("TOKEN:", token);

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// 🚨 RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      console.log("API ERROR:", error.response.data);

      // 🔥 HANDLE INVALID TOKEN ALSO (IMPORTANT)
      if (
        error.response.status === 401 ||
        error.response.data.message === "Invalid token"
      ) {
        console.log("Token expired / invalid → logout");

        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
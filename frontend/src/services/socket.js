// import { io } from "socket.io-client";

// // const socket = io("http://localhost:5000");
// const socket = io("https://dating-backend-d40u.onrender.com");

// export default socket;

// socket.js - frontend
import { io } from "socket.io-client";

const socket = io("https://dating-backend-d40u.onrender.com", {
  transports: ["websocket", "polling"],
  forceNew: true,
  reconnectionAttempts: 5,
  withCredentials: true,
  autoConnect: false, // ✅ YE ADD KARO - login ke baad manually connect hoga
});

export default socket;
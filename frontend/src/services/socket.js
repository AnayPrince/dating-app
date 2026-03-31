// import { io } from "socket.io-client";

// // const socket = io("http://localhost:5000");
// const socket = io("https://dating-backend-d40u.onrender.com");

// export default socket;

import { io } from "socket.io-client";

const socket = io("https://dating-backend-d40u.onrender.com", {
  transports: ["websocket", "polling"], // ✅ polling bhi add karo
  forceNew: true,
  reconnectionAttempts: 5,
  withCredentials: true, // ✅ ye add karo
});

export default socket;
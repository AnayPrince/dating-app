import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import toast from "react-hot-toast";

// 🔥 socket config
// const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
// });



export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [qr, setQr] = useState("");
  const [showQR, setShowQR] = useState(false);

   // ✅ socket state
  const [socket, setSocket] = useState(null);

  /* ======================
     SOCKET INIT
  ====================== */
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);
//logout button
  const logout = () => {
  localStorage.clear(); // 🔥 remove user + token

  toast.success("Logged out successfully 👋");

  navigate("/"); // 🔥 redirect to login
};

const enable2FA = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  if (!userId) {
    toast.error("User not found ❌");
    return;
  }

  try {
    const res = await API.post("/auth/enable-2fa", {
      userId,
    });

    setQr(res.data.qr);
    setShowQR(true);

    toast.success("Scan QR in Google Authenticator 📱");
  } catch (err) {
    console.log(err);
    toast.error("2FA failed ❌");
  }
};
  /* ======================
     🔐 PROTECT ROUTE
  ====================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  /* ======================
     SOCKET JOIN
  ====================== */
  useEffect(() => {
  if (!userId || !socket) return;

  socket.emit("join", userId);

    console.log("Socket joined:", userId);

    socket.on("newLike", (data) => {
      toast.success(`❤️ User ${data.fromUser} liked you`);
    });

socket.on("matchAlert", (data) => {
  toast.success("🎉 It's a Match!");

  setUsers((prev) =>
    prev.filter((u) => u._id !== data.fromUser)
  );

  navigate("/matches");
});

    return () => {
      socket.off("newLike");
      socket.off("matchAlert");
    };
  }, [userId]);

  /* ======================
     FETCH USERS
  ====================== */
  useEffect(() => {
    API.get("/users")
      .then((res) => {
        const filtered = res.data.filter((u) => u._id !== userId);

        setUsers(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);

        // 🔴 token invalid / expired
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        }

        setLoading(false);
      });
  }, [userId, navigate]);

  /* ======================
     LIKE USER
  ====================== */
  // const likeUser = async (id) => {
  //   try {
  //     const res = await API.post("/like", {
  //       toUser: id,
  //     });

  //     console.log("LIKE RESPONSE:", res.data);

  //     // 🔒 Already liked case
  //     if (res.data.message === "Already liked") {
  //       toast("Already liked 👍");

  //       // 👉 optional: remove user from UI
  //       setUsers((prev) => prev.filter((u) => u._id !== id));
  //       return;
  //     }

  //     // 🔥 socket emit
  //     socket.emit("likeUser", {
  //       toUser: id,
  //       fromUser: userId,
  //     });

  //     // 👉 remove from list
  //     setUsers((prev) => prev.filter((u) => u._id !== id));

  //     // 🎉 match case
  //     if (res.data.match) {
  //       toast.success("🎉 It's a Match!");

  //       socket.emit("matchFound", {
  //         toUser: id,
  //         fromUser: userId,
  //       });

  //       navigate("/matches");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const likeUser = async (id) => {
  try {
    const res = await API.post("/like", {
      toUser: id,
    });

    console.log("LIKE RESPONSE:", res.data);

    // 🔒 Already liked
    if (res.data.message === "Already liked") {
      toast("Already liked 👍");
      setUsers((prev) => prev.filter((u) => u._id !== id));
      return;
    }

    // 🔥 notify other user
    socket.emit("likeUser", {
      toUser: id,
      fromUser: userId,
    });

    // 👉 remove from UI
    setUsers((prev) => prev.filter((u) => u._id !== id));

    // ✅ ONLY emit match (no toast, no navigation)
    if (res.data.match) {
      socket.emit("matchFound", {
        toUser: id,
        fromUser: userId,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

  /* ======================
     UI
  ====================== */

  if (loading) {
    return <h2 className="text-center mt-10">Loading users...</h2>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 flex flex-col items-center py-10">
      <h2 className="text-4xl font-extrabold text-white mb-8 tracking-wide">
        🔥 Discover
      </h2>

      <button
  onClick={logout}
  className="absolute top-5 right-5 bg-red-500 px-5 py-2 rounded-full text-white font-semibold hover:scale-105"
>
  🚪 Logout
</button>

<button
  onClick={() => {
    if (!showQR) {
      enable2FA(); // first time API call
    } else {
      setShowQR(false); // hide QR
    }
  }}
  className="mb-6 bg-green-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105"
>
  🔐 {showQR ? "Hide QR" : "Enable 2FA"}
</button>

{showQR && qr && (
  <div className="bg-black p-4 rounded-xl text-center mb-6">
    <p className="text-white mb-2">
      Scan this QR in Google Authenticator
    </p>

    <img src={qr} alt="QR Code" className="mx-auto w-40" />

    <p className="text-gray-400 text-sm mt-2">
      After scanning, logout & login again 🔐
    </p>
  </div>
)}
      {users.length === 0 && (
        <p className="text-gray-300 text-lg">No users found 😢</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="relative w-80 bg-white/10 backdrop-blur-2xl 
  border border-white/20 rounded-3xl p-6 shadow-2xl 
  hover:scale-105 hover:shadow-pink-500/30 transition duration-300"
          >
            {/* Glow Effect */}
            <div
              className="absolute inset-0 rounded-3xl 
  bg-gradient-to-r from-pink-500 to-purple-500 
  opacity-10 blur-xl pointer-events-none"
            ></div>

            <div className="relative text-center z-10">
              {/* Avatar */}
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full 
    bg-gradient-to-r from-pink-500 to-purple-500 
    flex items-center justify-center text-2xl font-bold text-white"
              >
                {user.name.charAt(0)}
              </div>

              <h3 className="text-2xl font-bold text-white">{user.name}</h3>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6 relative z-10">
              <button
                onClick={() => likeUser(user._id)}
                className="bg-gradient-to-r from-pink-500 to-red-500 
      px-5 py-2 rounded-full shadow-lg 
      hover:scale-110 transition text-white font-semibold"
              >
                ❤️ Like
              </button>

              <button
                onClick={() =>
                  setUsers((prev) => prev.filter((u) => u._id !== user._id))
                }
                className="bg-gray-800 text-white px-5 py-2 rounded-full 
      hover:bg-gray-700 transition"
              >
                ❌ Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

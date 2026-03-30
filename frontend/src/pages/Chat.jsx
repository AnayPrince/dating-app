import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import API from "../services/api";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "fallback";
console.log("SECRET:", SECRET_KEY);

function Chat() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [preview, setPreview] = useState(null);

  const bottomRef = useRef();

  /* ======================
     🔐 DECRYPT
  ====================== */
const decryptMessage = (text) => {
  try {
    const bytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
    const result = bytes.toString(CryptoJS.enc.Utf8);
    return result || text;
  } catch {
    return text;
  }
};

  /* ======================
     🧨 SELF-DESTRUCT UI
  ====================== */
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.filter((msg) => {
          if (!msg.expiresAt) return true;
          return new Date(msg.expiresAt) > new Date();
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ======================
     🔌 JOIN
  ====================== */
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  /* ======================
     📥 LOAD MESSAGES
  ====================== */
  useEffect(() => {
    if (!user?._id || !id) return;

    const matchId = [user._id, id].sort().join("_");

    API.get(`/messages/${matchId}`)
      .then((res) => setMessages(res.data))
      .catch(console.log);
  }, [id, user?._id]);

  /* ======================
     👤 GET USER
  ====================== */
  useEffect(() => {
    API.get("/users")
      .then((res) => {
        const u = res.data.find((u) => u._id === id);
        setOtherUser(u);
      })
      .catch(console.log);
  }, [id]);

  /* ======================
     📡 RECEIVE MESSAGE
  ====================== */
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => socket.off("receiveMessage");
  }, []);

  /* ======================
     📤 SEND TEXT
  ====================== */

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      sender: user._id,
      receiver: id,
      message: text,
    });

    setText("");
  };

  /* ======================
     📷 SEND IMAGE
  ====================== */

  const sendImage = async (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await API.post("/upload", formData);

      socket.emit("sendMessage", {
        sender: user._id,
        receiver: id,
        message: res.data.imageUrl,
      });

      setTimeout(() => {
        setPreview(null);
        URL.revokeObjectURL(previewUrl);
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  /* ======================
     🤖 AI MESSAGE
  ====================== */
  const getAIMessage = async () => {
    const res = await fetch("http://localhost:8000/ai-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interests: "travel, music, movies",
        name: otherUser?.name || "User",
      }),
    });

    const data = await res.json();

    socket.emit("sendMessage", {
      sender: user._id,
      receiver: id,
      message: data.message,
    });
  };

  /* ======================
     🔽 AUTO SCROLL
  ====================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-black text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">{otherUser?.name}</h2>
        <p className="text-green-400 text-sm">● Online</p>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isMe = m.sender === user._id;
          const msgText = decryptMessage(m.message);

          return (
            <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs p-3 rounded-2xl ${isMe ? "bg-pink-500" : "bg-gray-800"}`}>

                {/* IMAGE */}
                {decryptMessage(m.message)?.startsWith("http") ? (
                  <img
                    src={decryptMessage(m.message)}
                    className="rounded-lg max-w-[180px]"
                  />
                ) : (
                  <p>{decryptMessage(m.message)}</p>
                )}

                {/* TIME */}
                <p className="text-[10px] text-right opacity-60 mt-1">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}

        {preview && (
          <div className="flex justify-end">
            <img src={preview} className="w-20 rounded" />
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-3 flex gap-2">
        <input
          type="file"
          hidden
          id="fileInput"
          onChange={(e) => sendImage(e.target.files[0])}
        />
        <label htmlFor="fileInput">📷</label>

        <input
          className="flex-1 p-2 bg-gray-800 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={getAIMessage}>🤖</button>
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default Chat;

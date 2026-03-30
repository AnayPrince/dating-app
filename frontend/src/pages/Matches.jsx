import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Matches() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:5000/api/matches/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("MATCHES DATA:", data);
        setMatches(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white flex flex-col items-center py-10">
      {/* TITLE */}
      <h2 className="text-4xl font-extrabold mb-8">💖 Your Matches</h2>

      {/* EMPTY */}
      {matches.length === 0 && (
        <p className="text-gray-300 text-lg">No matches yet 😢</p>
      )}

      {/* LIST */}
      <div className="w-full max-w-md flex flex-col gap-5">
        {matches.map((m) => {
          const otherUser = m.users?.find((u) => u._id !== user._id);

          if (!otherUser) return null;

          return (
            <div
              key={m._id}
              className="flex items-center justify-between 
              bg-white/10 backdrop-blur-xl border border-white/20 
              rounded-2xl p-4 shadow-lg hover:scale-105 transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                {/* AVATAR */}
                <div
                  className="w-12 h-12 rounded-full 
                bg-gradient-to-r from-pink-500 to-purple-500 
                flex items-center justify-center font-bold text-white"
                >
                  {otherUser.name.charAt(0)}
                </div>

                {/* INFO */}
                <div>
                  <h3 className="text-lg font-semibold">{otherUser.name}</h3>
                  <p className="text-sm text-gray-300">{otherUser.email}</p>
                </div>
              </div>

              {/* CHAT BUTTON */}
              <button
                onClick={() => navigate(`/chat/${otherUser._id}`)}
                className="bg-gradient-to-r from-pink-500 to-red-500 
                px-4 py-2 rounded-full text-sm font-semibold 
                hover:scale-105 transition shadow-md"
              >
                💬 Chat
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Matches;

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 
    bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">

      {/* LOGO */}
      <h1 className="text-2xl font-bold text-pink-500 tracking-wide drop-shadow-lg">
        ❤️ DateX
      </h1>

      {/* NAV LINKS */}
      <div className="flex gap-6 text-lg">

        <NavLink 
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 font-semibold"
              : "hover:text-pink-400 transition duration-300"
          }
        >
          Discover
        </NavLink>

        <NavLink 
          to="/matches"
          className={({ isActive }) =>
            isActive
              ? "text-pink-500 font-semibold"
              : "hover:text-pink-400 transition duration-300"
          }
        >
          Matches
        </NavLink>

      </div>

    </div>
  );
}
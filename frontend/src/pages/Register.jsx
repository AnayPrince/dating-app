// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import toast from "react-hot-toast";

// export default function Register() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // if (!form.name || !form.email || !form.password) {
//     //   toast.error("All fields are required");
//     //   return;
//     // }

//     if (!form.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }

//     if (!form.email.includes("@")) {
//       toast.error("Invalid email");
//       return;
//     }

//     if (form.password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     try {
//       const res = await API.post("/auth/register", form);

//       toast.success("Registered Successfully 🎉");

//       // redirect to login
//       navigate("/");
//     } catch (err) {
//       console.log(err);
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-pink-900">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-[350px] border border-white/20 shadow-2xl"
//       >
//         <h2 className="text-3xl text-white font-bold text-center mb-6">
//           📝 Register
//         </h2>

//         {/* Name */}
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full mb-4 px-4 py-2 rounded-full bg-white/20 text-white outline-none"
//         />

//         {/* Email */}
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full mb-4 px-4 py-2 rounded-full bg-white/20 text-white outline-none"
//         />

//         {/* Password */}
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full mb-6 px-4 py-2 rounded-full bg-white/20 text-white outline-none"
//         />

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-pink-500 to-red-500 py-2 rounded-full text-white font-semibold hover:scale-105 transition"
//         >
//           Register
//         </button>

//         {/* Redirect */}
//         <p className="text-gray-300 text-sm text-center mt-4">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/")}
//             className="text-pink-400 cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.email.includes("@")) {
      toast.error("Invalid email");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/auth/register", form); // ✅ res remove kiya

      toast.success("Registered Successfully 🎉");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-pink-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-[350px] border border-white/20 shadow-2xl"
      >
        <h2 className="text-3xl text-white font-bold text-center mb-6">
          📝 Register
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded-full bg-white/20 text-white outline-none placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded-full bg-white/20 text-white outline-none placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 rounded-full bg-white/20 text-white outline-none placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 py-2 rounded-full text-white font-semibold hover:scale-105 transition"
        >
          Register
        </button>

        {/* Redirect */}
        <p className="text-gray-300 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-pink-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

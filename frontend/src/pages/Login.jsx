// // import { useState } from "react";
// // import API from "../services/api";
// // import { useNavigate } from "react-router-dom";
// // import toast from "react-hot-toast"; // ✅ ADD THIS

// // export default function Login() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const navigate = useNavigate();

// //   const login = async () => {
// //     // ✅ VALIDATION
// //     if (!email || !password) {
// //       toast.error("All fields required");
// //       return;
// //     }

// //     try {
// //       const res = await API.post("/auth/login", {
// //         email,
// //         password,
// //       });

// //       localStorage.setItem("userId", res.data.user._id);
// //       localStorage.setItem("token", res.data.token);
// //       localStorage.setItem("user", JSON.stringify(res.data.user));

// //       toast.success("Login successful 🎉"); // ✅ ADD THIS

// //       navigate("/dashboard");
// //     } catch (err) {
// //       console.error(err);

// //       toast.error(
// //         err.response?.data?.message || "Login failed ❌"
// //       ); // ❌ alert remove
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
// //       <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 border border-gray-700 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
// //         <div className="text-center mb-8">
// //           <h1 className="text-4xl font-bold text-white">💖 Matchify</h1>
// //           <p className="text-gray-400 mt-2">Find your perfect match</p>
// //         </div>

// //         <div className="mb-4">
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
// //             onChange={(e) => setEmail(e.target.value)}
// //           />
// //         </div>

// //         <div className="mb-6">
// //           <input
// //             type="password"
// //             placeholder="Password"
// //             className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
// //             onChange={(e) => setPassword(e.target.value)}
// //           />
// //         </div>

// //         <button
// //           onClick={login}
// //           className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
// //         >
// //           🚀 Login
// //         </button>

// //         <p className="text-center text-gray-400 mt-5 text-sm">
// //           Don’t have an account?{" "}
// //           <span
// //             className="text-pink-400 cursor-pointer hover:underline"
// //             onClick={() => navigate("/register")}
// //           >
// //             Register
// //           </span>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // 🔐 2FA STATES
//   const [showOTP, setShowOTP] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [tempUserId, setTempUserId] = useState("");

//   const navigate = useNavigate();

//   /* ======================
//      LOGIN
//   ====================== */
//   const login = async () => {
//     if (!email || !password) {
//       toast.error("All fields required");
//       return;
//     }

//     try {
//       const res = await API.post("/auth/login", {
//         email,
//         password,
//       });

//       // 🔥 IF 2FA ENABLED
//       if (res.data.require2FA) {
//         setShowOTP(true);
//         setTempUserId(res.data.userId);
//         toast("Enter OTP from Google Authenticator 🔐");
//         return;
//       }

//       // ✅ NORMAL LOGIN
//       localStorage.setItem("userId", res.data.user.id);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       toast.success("Login successful 🎉");
//       navigate("/dashboard");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed ❌");
//     }
//   };

//   /* ======================
//      VERIFY OTP
//   ====================== */
//   const verifyOTP = async () => {
//     if (!otp) {
//       toast.error("Enter OTP");
//       return;
//     }

//     try {
//       const res = await API.post("/auth/verify-2fa", {
//         userId: tempUserId,
//         token: otp,
//       });

//       localStorage.setItem("token", res.data.token);

//       toast.success("2FA Verified ✅");
//       navigate("/dashboard");
//     } catch (err) {
//       toast.error("Invalid OTP ❌");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
//       <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 border border-gray-700 shadow-[0_0_40px_rgba(236,72,153,0.3)]">

//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white">💖 Matchify</h1>
//           <p className="text-gray-400 mt-2">Find your perfect match</p>
//         </div>

//         {/* 🔐 NORMAL LOGIN FORM */}
//         {!showOTP && (
//           <>
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-600"
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white border border-gray-600"
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button
//               onClick={login}
//               className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
//             >
//               🚀 Login
//             </button>
//           </>
//         )}

//         {/* 🔐 OTP SCREEN */}
//         {showOTP && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-600"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//             />

//             <button
//               onClick={verifyOTP}
//               className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold"
//             >
//               ✅ Verify OTP
//             </button>
//           </>
//         )}

//         <p className="text-center text-gray-400 mt-5 text-sm">
//           Don’t have an account?{" "}
//           <span
//             className="text-pink-400 cursor-pointer"
//             onClick={() => navigate("/register")}
//           >
//             Register
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // 🔐 2FA
//   const [twoFA, setTwoFA] = useState(false);
//   const [otp, setOtp] = useState("");

//   const navigate = useNavigate();

// const login = async () => {
//   if (!email || !password) {
//     toast.error("All fields required");
//     return;
//   }

//   try {
//     const res = await API.post("/auth/login", {
//       email,
//       password,
//       token: otp,
//     });

//     console.log("LOGIN RESPONSE:", res.data);

//     if (res.data?.require2FA) {
//       setTwoFA(true);
//       toast("Enter 2FA code 🔐");
//       return;
//     }

//     // 🔥 FIX START
//     const token =
//       res.data.token ||
//       res.data.accessToken ||
//       res.data?.data?.token;

//     if (!token) {
//       console.log("❌ Token missing:", res.data);
//       toast.error("Token not received ❌");
//       return;
//     }
//     // 🔥 FIX END

//     localStorage.setItem("user", JSON.stringify(res.data.user));
//     localStorage.setItem("token", token);

//     console.log("✅ SAVED TOKEN:", localStorage.getItem("token"));

//     toast.success("Login successful 🎉");
//     navigate("/dashboard");

//   } catch (err) {
//     console.log(err);
//     toast.error(err.response?.data?.message || "Login failed ❌");
//   }
// };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
//       <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 border border-gray-700 shadow-[0_0_40px_rgba(236,72,153,0.3)]">

//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white">💖 Matchify</h1>
//           <p className="text-gray-400 mt-2">Find your perfect match</p>
//         </div>

//         {/* EMAIL */}
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-600"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* PASSWORD */}
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-600"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {/* 🔐 OTP FIELD (ONLY IF REQUIRED) */}
//         {twoFA && (
//           <input
//             type="text"
//             placeholder="Enter 2FA Code"
//             className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-green-500"
//             onChange={(e) => setOtp(e.target.value)}
//           />
//         )}

//         <button
//           onClick={login}
//           className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
//         >
//           🚀 {twoFA ? "Verify & Login" : "Login"}
//         </button>

//         <p className="text-center text-gray-400 mt-5 text-sm">
//           Don’t have an account?{" "}
//           <span
//             className="text-pink-400 cursor-pointer"
//             onClick={() => navigate("/register")}
//           >
//             Register
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState(""); // ✅ userId store karo

  const navigate = useNavigate();

  /* ======================
     STEP 1 - NORMAL LOGIN
  ====================== */
  const login = async () => {
    if (!email || !password) {
      toast.error("All fields required");
      return;
    }

    try {
      // ✅ Sirf email + password bhejo, token nahi
      const res = await API.post("/auth/login", { email, password });

      console.log("LOGIN RESPONSE:", res.data);

      // 🔐 2FA required hai
      if (res.data?.require2FA) {
        setTwoFA(true);
        setTempUserId(res.data.userId); // backend se userId aani chahiye
        toast("Enter 2FA code 🔐");
        return;
      }

      // ✅ Normal login success
      const token = res.data.token;
      if (!token) {
        toast.error("Token not received ❌");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful 🎉");
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Login failed ❌");
    }
  };

  /* ======================
     STEP 2 - VERIFY 2FA OTP
  ====================== */
  const verifyOTP = async () => {
    if (!otp) {
      toast.error("OTP enter karo");
      return;
    }

    try {
      // ✅ Alag endpoint pe OTP verify karo
      const res = await API.post("/auth/verify-2fa", {
        userId: tempUserId,
        token: otp,
      });

      const token = res.data.token;
      if (!token) {
        toast.error("Token not received ❌");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("2FA Verified ✅");
      navigate("/dashboard");

    } catch (err) {
      toast.error("Invalid OTP ❌");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 border border-gray-700 shadow-[0_0_40px_rgba(236,72,153,0.3)]">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">💖 Matchify</h1>
          <p className="text-gray-400 mt-2">Find your perfect match</p>
        </div>

        {/* NORMAL LOGIN - 2FA nahi hai tab */}
        {!twoFA && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={login}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
            >
              🚀 Login
            </button>
          </>
        )}

        {/* 2FA OTP SCREEN */}
        {twoFA && (
          <>
            <p className="text-white text-center mb-4">
              Google Authenticator se OTP enter karo 🔐
            </p>
            <input
              type="text"
              placeholder="6-digit OTP"
              maxLength={6}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-green-500 focus:outline-none text-center text-2xl tracking-widest"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOTP}
              className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold hover:scale-105 transition"
            >
              ✅ Verify OTP
            </button>
            <button
              onClick={() => setTwoFA(false)}
              className="w-full py-2 mt-2 text-gray-400 text-sm hover:text-white"
            >
              ← Wapas jao
            </button>
          </>
        )}

        <p className="text-center text-gray-400 mt-5 text-sm">
          Don't have an account?{" "}
          <span
            className="text-pink-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react"; // ✅ icons

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-blue-50  via-white to-purple-50 relative">
      {/* Glow / Decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-400/30 rounded-full blur-3xl"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">
          Join SwapHub and start swapping skills today!
        </p>

        {/* Error */}
        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <div className="relative rounded-lg overflow-hidden">
                          {/* gradient border layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600  to-pink-600"></div>
            <input
              className="relative w-full px-4 py-2 bg-white/80 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-0"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
           
            <div className="relative rounded-lg overflow-hidden">
                          {/* gradient border layerr */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600   to-pink-600"></div>
            <input
              className="relative w-full px-4 py-2 bg-white/80 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-0"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
         </div>
          </div>

           <button
                type="submit"
                className="relative w-full py-3 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition overflow-hidden"
                  >
                    {/*gradient background. 110 makes the gradient bg ~10% larger so the "hard stop' colors sit outside the clipped area*/}
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-600  to-pink-600 scale-110"></span>

                {/* text sits above gradient */}
                <span className="relative z-10">Sign Up</span> {/* button text wrapped in relative z-10 so it stays above the gradient background */}
            </button>
              </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

      { /* {/* Social Placeholder 
        <div className="flex justify-center gap-4"> 
          <button className="p-3 rounded-lg border hover:bg-gray-100">
             Google
          </button>
          <button className="p-3 rounded-lg border hover:bg-gray-100">
             Twitter
          </button>
        </div> */}

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-500 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
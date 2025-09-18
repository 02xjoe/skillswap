import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  /** Bring in login function from our Auth context */
  const { login } = useAuth();

  /** Track form state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /** Navigation helpers */
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // redirect after login

  /** Handle login form submit */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password); // firebase login
      navigate(from, { replace: true }); // go to dashboard or intended page
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      {/** Outer wrapper takes full height and centers content */}

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8">
        {/** Card with glassmorphism effect */}

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/** Show errors if any */}
          {error && (
            <div className="p-3 border rounded-lg text-red-600 bg-red-50 text-sm">
              {error}
            </div>
          )}

          {/** Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/** Password Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/** Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Log in
          </button>
        </form>

        {/** Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/** Extra CTA */}
        <p className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
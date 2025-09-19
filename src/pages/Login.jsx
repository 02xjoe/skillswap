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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
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
            <div className="relative rounded-lg overflow-hidden">
                          {/* gradient border layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

                          {/* input with padding so border shows */}
            <input
                type="email"
                placeholder="Enter your email"
                className="relative w-full px-4 py-2 bg-white/80 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
        </div>
              
          {/** Password Input */}
          <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                          Password
                </label>
                <div className="relative rounded-lg overflow-hidden">
                          {/* gradient border layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

                          {/* input with padding so border shows */}
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="relative w-full px-4 py-2 bg-white/80 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                />
                </div>
          </div>

          {/** Submit Button */}
                 <button
                      type="submit"
                      className="relative w-full py-3 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition overflow-hidden"
                  >
                      {/*gradient background. 110 makes the gradient bg ~10% larger so the "hard stop' colors sit outside the clipped area*/}
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 scale-110"></span>

                      {/* text sits above gradient */}
                      <span className="relative z-10">Log in</span> {/* button text wrapped in relative z-10 so it stays above the gradient background */}
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
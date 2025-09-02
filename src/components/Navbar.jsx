import { Link, NavLink } from "react-router-dom";               // links
import { useAuth } from "../context/AuthContext.jsx";           // auth state

export default function Navbar() {
  const { user, logout } = useAuth();                           // user + logout fn

  return (
    // full-width header bar
    <header className="w-full bg-white border-b">
      {/* use a wide container so content isn’t cramped; add gap for spacing */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-8 px-4 py-3">
        {/* brand on the left */}
        <Link to="/" className="text-2xl font-bold text-blue-600">SwapHub</Link> 

        {/* nav links on the right; 'ml-auto' pushes them away from brand */}
        <nav className="ml-auto flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-700"}>Home</NavLink>
          <NavLink to="/skills" className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-700"}>Skills</NavLink>

          {!user ? (
            <>
              {/* simple border button */}
              <Link to="/login" className="text-blue-600">Login</Link>
              {/* solid CTA button */}
              <Link to="/register" className="text-blue-600">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="px-4 py-2 ">Dashboard</Link>
              <button onClick={logout} className="bg-blue-600 text-blue px-3 py-1 ">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

        
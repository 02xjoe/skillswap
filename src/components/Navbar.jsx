import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">SwapHub</Link>

            <nav className="flex items-center gap-4">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Home</NavLink>
            <NavLink to="/skills" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Skills</NavLink>

            {!user ? (
            <>
              <Link to="/login" className="px-3 py-1 rounded border">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-blue-600 text-white">Sign Up</Link>
            </>
            ) : (
            <>
              <Link to="/dashboard" className="px-3 py-1 rounded border">Dashboard</Link>
              <button onClick={logout} className="px-3 py-1 rounded border">Logout</button>
            </>
           )}
           </nav>
        </div>
    </header>
  )
}
        
import { Link,NavLink} from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
    const {user,logout} = useAuth()

    return (
        <header className= "border-b bg-white">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <Link to='/' className= "font-bold">SkillSwap</Link>
                <nav className='"flex items-center gap-4'>
                    <NavLink to="/" className="hover:underline">Home</NavLink>
                    {user && <NavLink to="/dashboard"
                    className="hover:underline">Dashboard</NavLink>}
                    {user && <NavLink to="/profile"
                    className="hover:underline">Profile</NavLink>}
                    {!user ?(
                        <><NavLink to="/login" className="px-3 py-1 rounded-lg border">Login</NavLink>
                        <NavLink to="/register" className="px-3 py-1 rounded-lg bg-black text-white">Sign Up</NavLink>
                        </>
                    ):(
                        <button onClick={logout} className="px-3 py-1 rounded-lg border">Logout</button>
                    )}          
                </nav>
            </div>
        </header>
    )
}
        
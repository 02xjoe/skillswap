import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate,useLocation,Link } from "react-router-dom";

export default function Login(){
    const {login} = useAuth()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dashboard'

    async function handleSubmit(e){
        e.preventDefault()
        setError('')

        try{
            await login(email,password)
            navigate(from,{replace:true})
        }catch(error){
            setError(error.message)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg bg-white">
            <h1 className="text-2xl font-semibold mb-4">Log in</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                {error && <div className="p-2 border rounded text-red-600">{error}</div>}
                <input className="w-full p-2 border rounded"
                placeholder="Email" type="email" value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <input className="w-full p-2 border rounded"
                placeholder="Password" type="password" value={password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <button type="submit" className="w-full p-2 bg-black text-white rounded">Log in</button>
                
            </form>
            <p className="mt-2 text-sm">No account? <Link to='/register' className="underline">Sign up</Link></p>
        </div>
    )
}
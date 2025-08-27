import {useState} from 'react'
import {useAuth} from '../context/AuthContext.jsx'
import {useNavigate,Link} from 'react-router-dom'

export default function Register(){
    const {register} = useAuth()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        setError('')

        try{
            await register(email,password)
            navigate('/dashboard')
        }catch(error){
            setError(error.message)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className='text-2xl font-semibold mb-4'>Create account</h1>
            <form onSubmit={handleSubmit} className='space-y-3'>
                {error && <div className='p-2 border rounded text-red-600'>{error}</div>}
                <input className='w-full p-2 border rounded'
                placeholder='Email' type='email' value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <input className='w-full p-2 border rounded'
                placeholder='Email' type='email' value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <input className='w-full p-2 border rounded'
                placeholder='Password' type='password' value={password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <button className='w-full border p-2 rounded bg-black text-white'>Sign up</button>
            </form>

                <p className='mt-2 text-sm'>Already have an account?? <Link to='/login' classname='underline'>
                    Log in</Link>
                </p>


        </div>
    )
}
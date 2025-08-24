import {createContent, useContext, useState, useEffect, createContext} from 'react'
    import {auth} from './services/firebase.js'
    import{
        onAuthStateChanged,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
    } from 'firebase/auth'

    const AuthContent = createContext()

    export function AuthProvider({children}){
        const [user,setUser] = useState(null)
        const [loading,setLoading] = useState(true)

        useEffect(()=>{
            const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
                setUser(currentUser)
                setLoading(false)
            })
            return ()=> unsubscribe()
        },[])

        const login = (email,password) => signInWithEmailAndPassword(auth,email,password)
        const register = (email,password) => createUserWithEmailAndPassword(auth,email,password)
        const logout = () => signOut(auth)

        const value = {user,login,register,logout}

        if (loading) return <div className='p-4'>Loading...</div>

        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    }


    export function useAuth(){
        const context = useContext(AuthContent)
        if(!context) throw new Error('useAuth must be used within an AuthProvider')
            return context
    }
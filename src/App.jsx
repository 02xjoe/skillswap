import {Routes,Route,Navigate} from 'react-router-dom'
import Navbar from  './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Skills from './pages/Skills.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import {AuthProvider} from './context/AuthContext.jsx'

export default function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <main className='max-w-6xl mx-auto p-4'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route
               path='/dashboard'
               element={
                 <ProtectedRoute>
                   <Dashboard/>
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                <Profile/>
                </ProtectedRoute>
              }
            />
            <Route
              path='/skills'
              element={
                <ProtectedRoute>
                <Skills/>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<Navigate to='/'replace/>}/>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
  
  






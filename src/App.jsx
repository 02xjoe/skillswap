import {Routes,Route,Navigate} from 'react-router-dom'
import Navbar from  './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Skills from './pages/Skills.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    // full-screen height + light gray background
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* full-width navbar at the top */}
      <Navbar />

      {/* FULL-WIDTH main area (remove max-w constraint) */}
      <main className="w-full">
        {/* declare the app routes */}
        <div className="max-w-7xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />

          {/* protected pages require auth */}

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
            {/* fallback: redirect any unknown routes to home */}
            <Route path='*' element={<Navigate to='/'replace/>}/>
          </Routes>
        
        </div>
        
      </main>
    </div>
  );
}
  
  









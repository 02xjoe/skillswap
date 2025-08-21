import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "tailwindcss"
import './index.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-600">
        Hello Tailwind v4
      </h1>
      <p className="text-red-500">If this is red, Tailwind works!</p>
    </div>
  )
}
  
  






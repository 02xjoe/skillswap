// Home.jsx
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* 🔹 HERO BANNER */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Left Side: Headline + Text + Buttons */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">SwapHub</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Exchange skills, connect with learners, and grow together —
              without spending a dime. 🚀
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex gap-6">
              <Link 
                to="/register" 
                className="bg-yellow-300 text-blue-800 font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-200"
              >
                Sign Up
              </Link>
              <Link 
                to="/login" 
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right Side: Illustration / Placeholder Box */}
          <div className="flex-1 flex justify-center">
            <div className="w-80 h-80 bg-white/10 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🤝</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 FEATURED SKILLS SECTION */}
      <section className="max-w-6xl mx-auto py-16 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Featured Skills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left side - intro text */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Discover & Share Skills
            </h3>
            <p className="text-gray-600 mb-6">
              Find skills offered by the community and showcase your own.
              Whether you want to learn coding, design, languages, or cooking,
              there’s something for everyone.
            </p>
            <Link 
              to="/skills" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
            >
              Browse Skills
            </Link>
          </div>

          {/* Right side - skills list */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Popular Right Now</h4>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md">💻 React Development</li>
              <li className="p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md">🎨 Graphic Design</li>
              <li className="p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md">🌍 Spanish Language</li>
              <li className="p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md">🍳 Cooking Skills</li>
              <li className="p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md">📸 Photography</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🔹 HOW IT WORKS SECTION */}
      <section className="bg-gray-100 py-20 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">1. Share Your Skill</h3>
            <p className="text-gray-600">Post what you know — from coding to cooking — and let others discover it.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">2. Find a Match</h3>
            <p className="text-gray-600">Browse skills offered by others and connect instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">3. Swap & Learn</h3>
            <p className="text-gray-600">Exchange skills and grow your knowledge community.</p>
          </div>
        </div>
      </section>

    </div>
  )
}
// Import React and useState
import React, { useState } from "react";

// Home component
export default function Home() {
  // Dummy skills (later you’ll fetch from backend)
  const [skills] = useState([
    "React Development",
    "Graphic Design",
    "Cooking",
    "Video Editing",
    "Digital Marketing",
    "UI/UX Design",
    "Photography",
    "Python Programming",
  ]);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filter skills based on user search
  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 pt-6">
       
      {/* ===== HERO SECTION ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT SIDE (Headline + CTA) */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">SwapHub</span>
          </h1>

          <p className="text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
            Trade your skills, connect with others, and learn new things. 
            Whether it’s coding, design, or cooking, you can swap and grow together.
          </p>

          {/* Buttons */}
          <div className="flex justify-center md:justify-start space-x-4 mb-8">
            <a
              href="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* RIGHT SIDE (Search + Skills) */}
        <div>
          {/* Search box */}
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Featured Skills
          </h2>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-lg font-medium text-blue-600">{skill}</h3>
                  <p className="text-gray-500 text-sm">Available for exchange</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">No skills found.</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== WHY SWAPHUB ===== */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why SwapHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">No Cost</h3>
            <p className="text-gray-600">Exchange skills without money. Just pure collaboration.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Global Network</h3>
            <p className="text-gray-600">Connect with people worldwide with diverse talents.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Learn Fast</h3>
            <p className="text-gray-600">Access real-world expertise and grow faster than courses.</p>
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="max-w-7xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Step 1</h3>
            <p className="text-gray-600">Post your skills and list what you can teach or do.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Step 2</h3>
            <p className="text-gray-600">Browse other people’s skills and find your perfect match.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Step 3</h3>
            <p className="text-gray-600">Swap skills, connect, and start learning together.</p>
          </div>
        </div>
      </div>

      {/* ===== TESTIMONIALS ===== */}
      <div className="max-w-7xl mx-auto mt-20 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <p className="text-gray-600 italic">"I swapped my design skills for coding lessons. Best experience ever!"</p>
            <h4 className="mt-4 text-sm font-semibold text-gray-700">– Alex M.</h4>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <p className="text-gray-600 italic">"SwapHub helped me learn cooking while I taught photography."</p>
            <h4 className="mt-4 text-sm font-semibold text-gray-700">– Priya K.</h4>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <p className="text-gray-600 italic">"It’s amazing to connect with people worldwide through skill-sharing."</p>
            <h4 className="mt-4 text-sm font-semibold text-gray-700">– David L.</h4>
          </div>
        </div>
      </div>

      {/* ===== FINAL CTA BANNER ===== */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-16 mt-16 ">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to start swapping?</h2>
          <p className="mb-6 text-lg text-blue-100">Join thousands of learners and skill-sharers today.</p>
          <div className="flex justify-center space-x-4">
            <a href="/signup" className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:scale-105 hover:bg-gray-100 transition">
              Sign Up Free
            </a>
            <a href="/login" className="px-6 py-3 border border-white text-white rounded-lg shadow-lg hover:scale-105 hover:bg-blue-500 transition">
              Login
            </a>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Column 1 */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">SwapHub</h3>
            <p className="text-sm">A community for exchanging skills and growing together.</p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/skills" className="hover:text-white">Skills</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">Contact</h3>
            <p className="text-sm">support@swaphub.com</p>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} SwapHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
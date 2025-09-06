// src/pages/Home.jsx
import React, { useState } from "react";
import Banner from "../components/Banner";   // full-width banner component
import Footer from "../components/Footer";   // full-width footer component
import { Link } from "react-router-dom";

export default function Home() {
  // dummy skills
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

  // search state
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // outer wrapper — full width, page background (no px here so children can be full width)
    <div className="w-full min-h-screen bg-gray-50">

      {/* ===== CENTERED PAGE CONTENT =====
          - This inner container keeps the main content readable and centered.
          - Use padding inside this container only for content; full-width sections live below.
      */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* HERO (left column / right column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-blue-600">SwapHub</span>
            </h1>

            <p className="text-gray-600 mb-6 max-w-md">
              Trade your skills, connect with others, and learn new things. Whether it’s coding,
              design, or cooking, you can swap and grow together.
            </p>

            <div className="flex justify-center md:justify-start space-x-4 mb-8">
              <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                Sign Up
              </Link>
              <Link to="/login" className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition">
                Login
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />

            <h2 className="text-xl font-semibold text-gray-700 mb-4">Featured Skills</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition">
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

        {/* ===== WHY SWAPHUB and other centered content continue here (still inside max-w-7xl) ===== */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why SwapHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">No Cost</h3>
              <p className="text-gray-600">Exchange skills without money. Just pure collaboration.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Global Network</h3>
              <p className="text-gray-600">Connect with people from around the world with diverse talents.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Learn Fast</h3>
              <p className="text-gray-600">Access real-world expertise and grow faster than traditional courses.</p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS & TESTIMONIALS (still centered) */}
        <div className="mt-16">
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

        <div className="mt-16">
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
      </div> {/* END centered max-w-7xl container */}

      {/* ===== FULL-WIDTH BANNER (outside centered container) ===== */}
      <div className="w-full mb-12">
        <Banner />
      </div>
      

      {/* ===== FULL-WIDTH FOOTER (outside centered container) ===== */}
      <Footer />
    </div>
  );
}
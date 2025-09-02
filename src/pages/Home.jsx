// 1. Import React + useState (for the search bar input)
import React, { useState } from "react"; 

// 2. Import Link from react-router-dom for navigation
import { Link } from "react-router-dom";

// 3. Define the Home component (main function for this page)
export default function Home() {
  // 4. Create a state variable to track search input
  // searchTerm = what the user types
  // setSearchTerm = function to update the value
  const [searchTerm, setSearchTerm] = useState("");

  return (
    // 5. Outer container: full width + min screen height + background color + padding
    <div className="w-full min-h-screen bg-gray-50 p-10">

      {/* 6. Main Grid Layout → Two Columns (left & right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ========== LEFT SIDE (Hero Section) ========== */}
        <div className="flex flex-col justify-center">
          
          {/* 7. Big Heading */}
          <h1 className="text-5xl font-bold text-blue-600 mb-6 drop-shadow-md">
            Welcome to SwapHub
          </h1>

          {/* 8. Introduction text below heading */}
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            A platform where you can swap skills, connect with learners, and grow together.
          </p>

          {/* 9. Buttons Section */}
          <div className="flex gap-6">
            
            {/* Sign Up button */}
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition-all"
            >
              Sign Up
            </Link>

            {/* Login button */}
            <Link 
              to="/login" 
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow hover:shadow-lg hover:bg-gray-300 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
        {/* END LEFT SIDE */}

        {/* ========== RIGHT SIDE (Search + Featured Skills) ========== */}
        <div className="flex flex-col gap-6">
          
          {/* 10. Search Bar Section */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-3">
            {/* Input field */}
            <input
              type="text"
              placeholder="Search for a skill..."
              value={searchTerm} // controlled input → linked to state
              onChange={(e) => setSearchTerm(e.target.value)} // updates state while typing
              className="flex-1 border-none outline-none px-2 text-gray-700"
            />
            {/* Button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Search
            </button>
          </div>

          {/* 11. Featured Skills Cards (3 cards stacked vertically) */}
          <div className="grid gap-6">
            
            {/* Card 1 - Web Dev */}
            <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all">
              <h2 className="text-xl font-semibold text-blue-600">🌐 Web Development</h2>
              <p className="text-gray-600 mt-2">Learn to build modern websites and apps.</p>
            </div>

            {/* Card 2 - Cooking */}
            <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all">
              <h2 className="text-xl font-semibold text-green-600">🍳 Cooking</h2>
              <p className="text-gray-600 mt-2">Master delicious recipes from around the world.</p>
            </div>

            {/* Card 3 - UI/UX */}
            <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all">
              <h2 className="text-xl font-semibold text-purple-600">🎨 UI/UX Design</h2>
              <p className="text-gray-600 mt-2">Design beautiful, user-friendly experiences.</p>
            </div>
          </div>
        </div>
        {/* END RIGHT SIDE */}
      </div>
      {/* END MAIN GRID */}

      {/* ========== BOTTOM SECTION (Steps) ========== */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Step 1 Card */}
        <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">1. Share Your Skill</h2>
          <p className="text-gray-600">Post what you know, from coding to cooking.</p>
        </div>

        {/* Step 2 Card */}
        <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all">
          <h2 className="text-xl font-semibold mb-2 text-green-600">2. Find a Match</h2>
          <p className="text-gray-600">Browse skills offered by others and connect instantly.</p>
        </div>

        {/* Step 3 Card */}
        <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all">
          <h2 className="text-xl font-semibold mb-2 text-purple-600">3. Swap & Learn</h2>
          <p className="text-gray-600">Exchange skills and grow your knowledge community.</p>
        </div>
      </div>
      {/* END BOTTOM SECTION */}
    </div>
  );
}
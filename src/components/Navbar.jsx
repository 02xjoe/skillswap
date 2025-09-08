// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
          SwapHub
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link
            to="/"
            className="text-gray-800 hover:text-blue-600 relative group"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            to="/skills"
            className="text-gray-800 hover:text-blue-600 relative group"
          >
            Skills
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            to="/about"
            className="text-gray-800 hover:text-blue-600 relative group"
          >
            About
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-blue-700 font-semibold hover:bg-blue-100 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
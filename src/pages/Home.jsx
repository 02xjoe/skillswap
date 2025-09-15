// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Repeat } from "lucide-react";
import {Pencil, Search, MessageSquare, } from "lucide-react";
import { motion } from "framer-motion"; // ✅ for animations;
import { Layers, Handshake, CheckCircle, Zap } from "lucide-react";
import { Briefcase, BookOpen, Code, Palette } from "lucide-react";
import { getAuth } from "firebase/auth";

export default function Home() { 
  const auth = getAuth()
  const user = auth.currentUser;
  const target = user ? "/dashboard" : "/register";
  return (
    <>
      {/* HERO SECTION */}

      <section className="relative w-full pt-24 min-h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 flex flex-col justify-center items-center text-center px-6 overflow-hidden ">
        {/* This section ensures the hero takes entire viewport and content is centered hori and vertically */ }
        {/* Floating Background Shapes */}
        <div className="absolute top-10 left-40 w-24 h-24 bg-yellow-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute middle-10 left-70 w-24 h-32 bg-red-400 rounded-full opacity-30 animate-spin"></div>

        {/* Headline */}
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
          Swap <span className="text-yellow-300">Skills</span>,  
          Learn <span className="text-pink-400">Faster</span>.
        </h1>

        {/* Sub-heading */}
        <p className="mt-6 text-lg md:text-2xl text-white/90 max-w-2xl">
          Connect with people worldwide and exchange knowledge that accelerates your growth.
        </p>

        {/* CTA Buttons */}
          {/* yellow bg draws attention, so primary CTA, sec CTA is transparent wit border. */}
        <div className="mt-10 flex space-x-4">
          <Link
            to={target}
            className="px-8 py-3 bg-yellow-300 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition"
          >
            Get Started Free
          </Link>
          <Link
            to={target}
            className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition"
          >
            Learn More
          </Link>
        </div>

        {/* Hero Icon */}
        <div className="mt-12">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md">
            <Repeat className="w-16 h-16 text-white" />
          </div>
        </div>
      </section>

      {/* FEATURED SKILLS */} 


      
      <section className="py-20 bg-gray-50">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Featured Skills
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover the most in-demand skills people are swapping today.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
          {[
            {
              icon: <Briefcase className="w-12 h-12 text-blue-600" />,
              title: "Business & Career",
              skills: ["Resume Writing", "Marketing", "Public Speaking"],
            },
            {
              icon: <BookOpen className="w-12 h-12 text-green-600" />,
              title: "Education & Tutoring",
              skills: ["Math", "Language Learning", "Exam Prep"],
            },
            {
              icon: <Code className="w-12 h-12 text-purple-600" />,
              title: "Tech & Coding",
              skills: ["Web Dev", "Python", "UI/UX"],
            },
            {
              icon: <Palette className="w-12 h-12 text-pink-600" />,
              title: "Creative Arts",
              skills: ["Drawing", "Music", "Video Editing"],
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-transform"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {item.icon}
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <ul className="mt-3 text-gray-600 space-y-1">
                {item.skills.map((skill, i) => (
                  <li key={i}>• {skill}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

       

        {/* CTA Button */}
        <div className="text-center mt-16 ">
            <Link to ={target}  className="px-6 py-3 !bg-gradient-to-r !from-pink-400 !via-red-400 !to-yellow-500  text-white  font-semibold rounded-lg 
          shadow-lg hover:opacity-90  !from-yellow-500 !via-red-500 !to-pink-400 focus:outline-none focus:ring-0  ">
            Explore All Skills
          </Link>
        </div>
      </section>

      {/* === REAL LIFE SWAP STORIES === */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-4">
          Real Life Swap Stories
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          See how people are exchanging skills and value in creative ways across the world.
        </p>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {/* Story 1 */}
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Student & Tuition</h3>
            <p className="text-gray-600 text-sm">
              A student couldn’t pay full tuition, so she worked weekends at a local business in exchange for school fees.
            </p>
          </div>

          {/* Story 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">Chef & Guitarist</h3>
            <p className="text-gray-600 text-sm">
              A chef offered private cooking classes in return for guitar lessons from a musician.
            </p>
          </div>

          {/* Story 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Designer & Developer</h3>
            <p className="text-gray-600 text-sm">
              A web developer built a portfolio site for a designer, who in return created branding assets.
            </p>
          </div>

          {/* Story 4 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-yellow-600 mb-2">Photographer & Event Planner</h3>
            <p className="text-gray-600 text-sm">
              A photographer covered an event for free, and got professional event planning for his own launch in return.
            </p>
          </div>
        </div>
      </section>
  


     {/*  ================= HOW IT WORKS SECTION =================*/}
      




      
      
      <section className="relative py-24 bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 text-white overflow-hidden">

        {/* Animated overlay for luxury glowing effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_70%)] animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-center text-lg text-gray-200 mb-16">
            SwapHub makes exchanging skills, services, or items seamless and rewarding.
          </p>

          {/* STEPS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* STEP 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition"
            >
              {/* Big faded step number */}
              <span className="absolute -top-6 left-4 text-6xl font-extrabold text-white/10">01</span>
              <Layers className="w-12 h-12 mx-auto mb-6 text-yellow-300" />
              <h3 className="text-xl font-semibold mb-2">List Your Skill or Item</h3>
              <p className="text-gray-300">
                Share what you can offer -  whether it’s coding, design, tutoring, or items to swap.
              </p>
            </motion.div>

            {/* STEP 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition"
            >
              <span className="absolute -top-6 left-4 text-6xl font-extrabold text-white/10">02</span>
              <Handshake className="w-12 h-12 mx-auto mb-6 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Find a Match</h3>
              <p className="text-gray-300">
                Explore listings from others and connect with people who need what you can offer.
              </p>
            </motion.div>

            {/* STEP 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition"
            >
              <span className="absolute -top-6 left-4 text-6xl font-extrabold text-white/10">03</span>
              <CheckCircle className="w-12 h-12 mx-auto mb-6 text-pink-400" />
              <h3 className="text-xl font-semibold mb-2">Swap & Collaborate</h3>
              <p className="text-gray-300">
                Agree on fair terms and start exchanging - services, items, or both.
              </p>
            </motion.div>

            {/* STEP 4 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:scale-105 hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition"
            >
              <span className="absolute -top-6 left-4 text-6xl font-extrabold text-white/10">04</span>
              <Zap className="w-12 h-12 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">Earn & Grow</h3>
              <p className="text-gray-300">
                Build connections, save money, and unlock new opportunities while growing your network.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      <svg
        className="w-full h-24"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#213547" /* {/* color matches footer background */
          d="M0,128L48,138.7C96,149,192,171,288,186.7C384,203,480,213,576,208C672,203,768,181,864,160C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z"
        ></path>
      </svg>
       
      



    </>

  );
}
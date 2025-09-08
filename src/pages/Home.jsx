// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Repeat } from "lucide-react";
import {Pencil, Search, MessageSquare, } from "lucide-react";
import { motion } from "framer-motion"; // ✅ for animations;
import { Layers, Handshake, CheckCircle, Zap } from "lucide-react";

export default function Home() {
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
            to="/signup"
            className="px-8 py-3 bg-yellow-300 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition"
          >
            Get Started Free
          </Link>
          <Link
            to="/how-it-works"
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
       {/* FEATURED SKILLS */}
      <section className=" py-20 bg-gray-50 ">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Featured Skills
        </h2>

        {/* Skills Grid container*/}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
          {/*i used .map() to loop through an array of skill names. for each new skill, a card is generated automatically */}
          {[
            "Language Exchange",
            "Graphic Design",
            "Cooking Lessons",
            "Digital Marketing",
            "Video Editing",
            "Photography",
          ].map((skill, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {skill}
              </h3>
              <p className="text-gray-600 text-sm">
                Available for swap with other skills
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link
            to="/skills"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 !text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
          >
            View All Skills
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-[2px] bg-gray-200"></div>

      {/* === REAL-LIFE SWAP EXAMPLES SECTION === */}
      <section className="py-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Real-Life Swaps
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Story 1 */}
          <div className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-700 italic">
              “A student couldn’t afford tuition fees, so a local business
              allowed them to work weekends in exchange. Both sides won.”
            </p>
            <span className="block mt-4 text-sm font-semibold text-gray-600">
              – Education Swap
            </span>
          </div>

          {/* Story 2 */}
          <div className="p-6 bg-gradient-to-r from-pink-100 to-pink-50 rounded-2xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-700 italic">
              “A designer created a brand identity for a marketer, and in
              return, learned growth-hacking strategies.”
            </p>
            <span className="block mt-4 text-sm font-semibold text-gray-600">
              – Design x Marketing
            </span>
          </div>

          {/* Story 3 */}
          <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-700 italic">
              “A chef offered cooking classes in exchange for guitar lessons.
              Two passions unlocked at once.”
            </p>
            <span className="block mt-4 text-sm font-semibold text-gray-600">
              – Food x Music
            </span>
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
                Share what you can offer — whether it’s coding, design, tutoring, or items to swap.
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
                Agree on fair terms and start exchanging — services, items, or both.
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
      


    </>

  );
}
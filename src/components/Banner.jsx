import React from "react";
import { Repeat } from "lucide-react";

export default function Banner() {
  return (
    <div className="w-full relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-7">
      {/* Grid for text + icon */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Left Column */}
        <div className="text-center md:text-left pl-12">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <Repeat className="w-8 h-8 mr-2 text-white/90" />
            <span className="uppercase tracking-wider text-sm font-medium text-white/80">
              Swap & Learn
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-yellow-300">Swap Skills</span>?
          </h2>

          <p className="mb-6 text-lg text-white/90 max-w-md mx-auto md:mx-0 ">
            Join SwapHub today and connect with people worldwide to exchange
            knowledge, grow your expertise, and build meaningful connections.
          </p>
        </div>

        {/* Right Column */}
        <div className="flex justify-center md:justify-end">
          <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md">
            <Repeat className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      {/* Centered CTA button (independent of the grid) */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <a
          href="/signup"
          className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
        >
          Get Started Free
        </a>
      </div>
    </div>
  );
}
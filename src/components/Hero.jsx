import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

export default function Hero() {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="w-full h-[80vh]"
      >
        {/* === Slide 1 === */}
        <SwiperSlide>
          <div
            className="flex flex-col items-center justify-center h-full text-white text-center px-6 bg-cover bg-center"
            style={{ backgroundImage: "url('/src/assets/hero/hero1.jpg')" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Welcome to SwapHub
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl drop-shadow-md">
              Trade your skills, connect with others, and learn something new.
            </p>
            <div className="flex space-x-4">
              <a
                href="/signup"
                className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="px-6 py-2 border border-white text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Login
              </a>
            </div>
          </div>
        </SwiperSlide>

        {/* === Slide 2 === */}
        <SwiperSlide>
          <div
            className="flex flex-col items-center justify-center h-full text-white text-center px-6 bg-cover bg-center"
            style={{ backgroundImage: "url('/src/assets/hero/hero2.jpg')" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Share Your Skills
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl drop-shadow-md">
              Post what you know, browse others, and swap knowledge effortlessly.
            </p>
            <a
              href="/skills"
              className="px-6 py-2 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Browse Skills
            </a>
          </div>
        </SwiperSlide>

        {/* === Slide 3 === */}
        <SwiperSlide>
          <div
            className="flex flex-col items-center justify-center h-full text-white text-center px-6 bg-cover bg-center"
            style={{ backgroundImage: "url('/src/assets/hero/hero3.jpg')" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Learn & Grow
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl drop-shadow-md">
              Access real-world expertise and grow faster than traditional courses.
            </p>
            <a
              href="/signup"
              className="px-6 py-2 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Get Started
            </a>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
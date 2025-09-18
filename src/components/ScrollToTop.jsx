// src/components/ScrollToTop.jsx with fade-up effect
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    /** Instantly reset scroll to top so page never flashes mid-content */
    window.scrollTo({ top: 0, behavior: "auto" });

    /** Add fade-up animation on every route change */
    const main = document.querySelector("main"); // target your main wrapper
    if (main) {
      main.classList.add("fade-up");  //every DOM element has a classList property(basically CSS classes. this line triggers the css animation written in index.css (.fade-up)...)

      const timer = setTimeout(() => {
        main.classList.remove("fade-up");
      }, 600); // after 600ms, remove the class to allow re-adding it on next route change

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
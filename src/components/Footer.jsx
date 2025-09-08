// src/components/Footer.jsx
import React from "react";
import { Mail, Twitter, Github, Linkedin, Instagram } from "lucide-react"; // icons

export default function Footer() {
  return (
    // outer footer  full width background (this should touch both edges)
    <footer className="w-full bg-gray-900 text-gray-300 mt-24">
      {/* inner content: constrained to max width for readable layout */}
      <div className="max-w-7xl mx-auto px-6 py-7 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Brand & short description */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">SwapHub</h3>
          <p className="text-sm">
            A community for exchanging skills and growing together. Teach, learn,
            and connect with people worldwide.
          </p>
          {/* small contact summary */}
          <div className="mt-4 text-sm text-gray-400">
            <div>📍 Lagos, Nigeria</div>
            <div>⏱ Mon–Fri, 9am–6pm</div>
          </div>
        </div>

        {/* Column 2: Contact details */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="text-sm space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-300" />
              <a href="mailto:support@swaphub.com" className="hover:text-white">
                support@swaphub.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 text-gray-300">📞</span>
              <a href="tel:+2348012345678" className="hover:text-white">
                +234 801 234 5678
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 text-gray-300">💬</span>
              <a href="/contact" className="hover:text-white">Contact Form</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Social links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>

          {/* Social icons row */}
          <div className="flex items-center space-x-4">
            {/* Each anchor opens in new tab - - replace hrefs with your real pages */}
            <a
              href="https://twitter.com/obahjoe"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>

            <a
              href="https://github.com/02xjoe"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>

            <a
              href="https://www.linkedin.com/in/02xjoe"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>

            <a
              href="https://instagram.com/obahjoe"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>

          {/* Optional small note or newsletter link */}
          <p className="text-sm text-gray-400 mt-4">
            Want updates? <a href="/newsletter" className="text-white underline">Join our newsletter</a>
          </p>
        </div>
      </div>

      {/* Bottom row: copyright + small links */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div>© {new Date().getFullYear()} SwapHub. All rights reserved.</div>

          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
            <a href="/help" className="hover:text-white">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
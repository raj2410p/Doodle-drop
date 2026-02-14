import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const HomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('https://doodle-drop-app-9d8bf42b718b.herokuapp.com/')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-full opacity-90 bg-white text-gray-800 font-sans">

      {/* Welcome Banner */}
      <div className="bg-blue-100 text-blue-800 text-center py-2 text-sm font-medium tracking-wide shadow-inner">
        ✨ Welcome to Doodle Drop — your personal space to organize, write & reflect.
      </div>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 max-w-7xl mx-auto">
        <div className="md:w-full space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Write freely. Organize easily.
          </h2>
          <p className="text-gray-600">
            Whether it's ideas, plans, or reminders — Doodle Drop is your secure, fast, and personal note-taking space.
          </p>
          <div className="space-x-4">
            <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
              Try it Free
            </Link>
            <a href="#features" className="text-blue-600 font-medium hover:underline">Learn More</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-3 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-10">Why Doodle Drop?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white shadow p-6 rounded">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Minimalist UI</h4>
              <p className="text-sm text-gray-600">Distraction-free interface to keep you focused on writing.</p>
            </div>
            <div className="bg-white shadow p-6 rounded">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Private & Secure</h4>
              <p className="text-sm text-gray-600">All notes are tied to your account using secure JWT auth.</p>
            </div>
            <div className="bg-white shadow p-6 rounded">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Built with Node.js and MySQL for speed and reliability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-3 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10 text-gray-800">What Our Users Say</h3>
          <div className="space-y-6">
            <blockquote className="bg-blue-50 px-3 py-4 rounded shadow text-gray-700 italic">
              “Doodle Drop is the easiest tool I’ve used for note-taking. Super clean and intuitive.”
              <br />
              <span className="text-sm font-bold block mt-2">— Aayushi M., UX Designer</span>
            </blockquote>
            <blockquote className="bg-blue-50 px-3 py-4 rounded shadow text-gray-700 italic">
              “Notes load instantly, and I love that they’re visible only to me.”
              <br />
              <span className="text-sm font-bold block mt-2">— Nishant P., Backend Developer</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-gray-100 py-5 px-10 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Doodle Drop.All rights reserved.</p>
          <div className="space-x-4 text-sm">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

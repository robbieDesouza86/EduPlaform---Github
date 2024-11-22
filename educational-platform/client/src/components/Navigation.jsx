import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navigation({ openLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-600 p-4 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">EduPlatform</Link>
        
        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="bg-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          <button onClick={() => scrollToSection('features')} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Features</button>
          <button onClick={() => scrollToSection('courses')} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Courses</button>
          <button onClick={() => scrollToSection('teachers')} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Teachers</button>
          <button onClick={openLogin} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Login</button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-indigo-600 shadow-md">
          <div className="flex flex-col space-y-2 p-4">
            <button onClick={() => scrollToSection('features')} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Features</button>
            <button onClick={() => scrollToSection('courses')} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Courses</button>
            <button onClick={() => scrollToSection('teachers')} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Teachers</button>
            <button onClick={() => { openLogin(); setIsMenuOpen(false); }} className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition duration-300 font-semibold">Login</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
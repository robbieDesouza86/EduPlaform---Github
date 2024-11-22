import React from 'react';

const sidebarItems = [
  { name: 'Dashboard', icon: '🏠' },
  { name: 'Classes', icon: '👥' },
  { name: 'Messages', icon: '💬' },
  { name: 'Schedule', icon: '📅' },
  { name: 'Courses', icon: '📚' },
  { name: 'Students', icon: '🎓' },
  { name: 'Financials', icon: '💰' },
  { name: 'Reviews', icon: '⭐' }, // Changed from 'Referrals' to 'Reviews'
  { name: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ activeTab, onTabClick, onSignOut, isOpen, onClose }) {
  return (
    <aside className={`bg-indigo-800 text-white flex flex-col w-64 h-screen fixed lg:relative transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} z-20`}>
      <div className="p-5 border-b border-indigo-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">EduPlatform</h1>
        <button 
          className="lg:hidden text-white bg-indigo-700 rounded-full p-1 focus:outline-none" 
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="flex-1 mt-5 overflow-y-auto">
        {sidebarItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-indigo-700 transition-colors duration-200 ${
              activeTab === item.name ? 'bg-indigo-700 text-white' : ''
            }`}
            onClick={() => onTabClick(item.name)}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto">
        <button 
          className="w-full bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-colors duration-200"
          onClick={onSignOut}
        >
          Sign Out
        </button>
        <footer className="bg-indigo-900 p-4">
          <p className="text-center text-indigo-200 text-sm">© 2023 EduPlatform. All rights reserved.</p>
        </footer>
      </div>
    </aside>
  );
}
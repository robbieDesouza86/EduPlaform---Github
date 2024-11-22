import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Classes from '../components/Classes';
import Messages from '../components/Messages';
import Schedule from '../components/Schedule';
import CourseManager from '../components/CourseManager';
import StudentManagement from '../components/StudentManagement';
import FinancialDashboard from '../components/FinancialDashboard';
import TeacherReviews from '../components/TeacherReviews'; // Import the new component
import Settings from '../components/Settings'; // Add this import

const tabIcons = {
  Dashboard: '🏠',
  Classes: '👥',
  Messages: '💬',
  Schedule: '📅',
  Courses: '📚',
  Students: '🎓',
  Financials: '💰',
  Reviews: '⭐', // Changed from 'Referrals' to 'Reviews'
  Settings: '⚙️', // Add this line
  // Add more icons for other tabs as needed
};

function convertGMTToIANA(gmtString) {
  // Handle cases where timezone isn't set
  if (!gmtString) return 'UTC';
  
  // Convert GMT±XX:XX format to Etc/GMT±X format
  try {
    // Extract the sign and hours from GMT string
    const match = gmtString.match(/GMT([+-])(\d{2}):00/);
    if (!match) return 'UTC';
    
    // Etc/GMT uses opposite sign convention
    const sign = match[1] === '+' ? '-' : '+';
    const hours = parseInt(match[2]);
    
    return `Etc/GMT${sign}${hours}`;
  } catch (error) {
    console.error('Error converting timezone:', error);
    return 'UTC';
  }
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/teacher/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched user data:', response.data);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Redirect to LandingPage
  };

  const updateUserData = async () => {
    await fetchUserData(); // Refresh user data
  };

  const formatTime = () => {
    try {
      if (!userData?.timeZone) return currentTime.toLocaleTimeString();
      const ianaTimezone = convertGMTToIANA(userData.timeZone);
      return currentTime.toLocaleTimeString(undefined, {
        timeZone: ianaTimezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return currentTime.toLocaleTimeString(); // Fallback to local time
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard currentDate={currentTime} />;
      case 'Classes':
        return <Classes />;
      case 'Messages':
        return <Messages />;
      case 'Schedule':
        return <Schedule />;
      case 'Courses':
        return <CourseManager />;
      case 'Students':
        return <StudentManagement />;
      case 'Financials':
        return <FinancialDashboard />;
      case 'Reviews':
        return <TeacherReviews />;
      case 'Settings':
        return <Settings onProfileUpdate={updateUserData} />;
      default:
        return <Dashboard currentDate={currentTime} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        onTabClick={handleTabClick} 
        onSignOut={handleSignOut}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{formatTime()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {userData && (
              <>
                <p className="text-sm text-gray-500 hidden sm:inline">
                  {userData.timeZone || 'GMT not set'}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium hidden sm:inline">
                    {userData.name}
                  </span>
                  {userData.profilePicture ? (
                    <img
                      src={`http://localhost:5000/uploads/${userData.profilePicture}`}
                      alt="Profile"
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400 h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </>
            )}
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

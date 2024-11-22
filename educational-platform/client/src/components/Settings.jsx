import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileManagement from './settings/ProfileManagement';
import TeacherProfilePage from './settings/TeacherProfilePage';

const Settings = ({ onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('http://localhost:5000/api/teacher/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched user data:', response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile & Account' },
    { id: 'teacherProfile', label: 'Teacher Profile' },
  ];

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    switch (activeTab) {
      case 'profile':
        return <ProfileManagement userData={userData} onProfileUpdate={onProfileUpdate} />;
      case 'teacherProfile':
        return <TeacherProfilePage 
          userData={userData} 
          selectedUserName={selectedUserName}
          onProfileUpdate={onProfileUpdate}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="flex mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 mr-2 rounded-t-lg ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
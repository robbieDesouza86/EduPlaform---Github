import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ProfileManagement = ({ userData, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileVisibility: 'public',
    paypalEmail: '',
    standardClassRate: '',
    trialClassRate: '',
    teacherId: '',
    timeZone: '',
    subjects: [],
    interests: [],
    languages: [],
    teachingStyles: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData) {
      setProfileData(prevData => ({
        ...prevData,
        ...userData,
      }));
      setLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [userData]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get('http://localhost:5000/api/teacher/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetched user profile:', response.data);
      
      if (response.data && typeof response.data === 'object') {
        setProfileData(prevData => ({
          ...prevData,
          ...response.data,
          teacherId: response.data.teacher_id || response.data.teacherId || ''
        }));
        setLoading(false);
      } else {
        throw new Error('Invalid data received from server');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const updateData = {
        name: profileData.name || '',
        timeZone: profileData.timeZone || '',
        profileVisibility: profileData.profileVisibility || 'public',
        paypalEmail: profileData.paypalEmail || '',
        standardClassRate: Number(profileData.standardClassRate) || 0,
        trialClassRate: Number(profileData.trialClassRate) || 0,
        education: [],
        workExperience: [],
        certificates: [],
        subjects: [],
        interests: [],
        languages: [],
        teachingStyles: []
      };

      const formData = new FormData();
      Object.keys(updateData).forEach(key => {
        if (Array.isArray(updateData[key])) {
          formData.append(key, JSON.stringify(updateData[key]));
        } else {
          formData.append(key, updateData[key].toString());
        }
      });

      const response = await axios.put(
        'http://localhost:5000/api/teacher/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Profile updated:', response.data);
      alert('Profile updated successfully!');

      if (onProfileUpdate) {
        onProfileUpdate();
      }

    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const tabs = [
    { name: 'Personal Info', icon: '👤' },
    { name: 'Account Settings', icon: '🔒' },
    { name: 'Payment Info', icon: '💰' },
  ];

  const timeZones = [
    { value: 'GMT-12:00', label: '(GMT-12:00) International Date Line West' },
    { value: 'GMT-11:00', label: '(GMT-11:00) Midway Island, Samoa' },
    { value: 'GMT-10:00', label: '(GMT-10:00) Hawaii' },
    { value: 'GMT-09:00', label: '(GMT-09:00) Alaska' },
    { value: 'GMT-08:00', label: '(GMT-08:00) Pacific Time (US & Canada)' },
    { value: 'GMT-07:00', label: '(GMT-07:00) Mountain Time (US & Canada)' },
    { value: 'GMT-06:00', label: '(GMT-06:00) Central Time (US & Canada), Mexico City' },
    { value: 'GMT-05:00', label: '(GMT-05:00) Eastern Time (US & Canada), Bogota, Lima' },
    { value: 'GMT-04:00', label: '(GMT-04:00) Atlantic Time (Canada), Caracas, La Paz' },
    { value: 'GMT-03:30', label: '(GMT-03:30) Newfoundland' },
    { value: 'GMT-03:00', label: '(GMT-03:00) Brazil, Buenos Aires, Georgetown' },
    { value: 'GMT-02:00', label: '(GMT-02:00) Mid-Atlantic' },
    { value: 'GMT-01:00', label: '(GMT-01:00) Azores, Cape Verde Islands' },
    { value: 'GMT+00:00', label: '(GMT+00:00) Western Europe Time, London, Lisbon, Casablanca' },
    { value: 'GMT+01:00', label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris' },
    { value: 'GMT+02:00', label: '(GMT+02:00) Egypt, South Africa' },
    { value: 'GMT+03:00', label: '(GMT+03:00) Baghdad, Riyadh, Moscow, St. Petersburg' },
    { value: 'GMT+03:30', label: '(GMT+03:30) Tehran' },
    { value: 'GMT+04:00', label: '(GMT+04:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
    { value: 'GMT+04:30', label: '(GMT+04:30) Kabul' },
    { value: 'GMT+05:00', label: '(GMT+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent' },
    { value: 'GMT+05:30', label: '(GMT+05:30) Bombay, Calcutta, Madras, New Delhi' },
    { value: 'GMT+05:45', label: '(GMT+05:45) Kathmandu' },
    { value: 'GMT+06:00', label: '(GMT+06:00) Almaty, Dhaka, Colombo' },
    { value: 'GMT+07:00', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
    { value: 'GMT+08:00', label: '(GMT+08:00) Beijing, Perth, Singapore, Hong Kong' },
    { value: 'GMT+09:00', label: '(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk' },
    { value: 'GMT+09:30', label: '(GMT+09:30) Adelaide, Darwin' },
    { value: 'GMT+10:00', label: '(GMT+10:00) Eastern Australia, Guam, Vladivostok' },
    { value: 'GMT+11:00', label: '(GMT+11:00) Magadan, Solomon Islands, New Caledonia' },
    { value: 'GMT+12:00', label: '(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka' }
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Profile & Account</h2>
      <Tabs>
        <TabList className="flex mb-4 border-b">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className="px-4 py-2 cursor-pointer focus:outline-none"
              selectedClassName="border-b-2 border-blue-500 font-semibold"
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email || ''}
                readOnly
                className="w-full p-2 border rounded bg-gray-300 text-gray-700"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Time Zone</label>
              <select
                name="timeZone"
                value={profileData.timeZone || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                <option value="">Select a time zone</option>
                {timeZones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </TabPanel>

        <TabPanel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Profile Visibility</label>
              <select
                name="profileVisibility"
                value={profileData.profileVisibility || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Teacher ID</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="teacherId"
                  value={profileData.teacherId || 'Not assigned'}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 text-gray-700 font-mono"
                />
                {profileData.teacherId && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(profileData.teacherId);
                      alert('Teacher ID copied to clipboard!');
                    }}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">This is your unique teacher identifier</p>
            </div>
          </form>
        </TabPanel>

        <TabPanel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">PayPal Email</label>
              <input
                type="email"
                name="paypalEmail"
                value={profileData.paypalEmail || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Standard Class Rate ($)</label>
              <input
                type="number"
                name="standardClassRate"
                value={profileData.standardClassRate || ''}
                onChange={handleInputChange}
                step="0.5"
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Trial Class Rate ($)</label>
              <input
                type="number"
                name="trialClassRate"
                value={profileData.trialClassRate || ''}
                onChange={handleInputChange}
                step="0.5"
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </TabPanel>
      </Tabs>
      <button
        type="submit"
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileManagement;

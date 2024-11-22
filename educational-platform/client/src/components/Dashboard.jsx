import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';

export default function Dashboard({ currentDate }) {
  const [dashboardData, setDashboardData] = useState({
    totalClasses: 24,
    totalStudents: 156,
    monthlyEarnings: 3500,
    todaysClasses: [
      { time: '09:00 AM', name: 'Introduction to React', students: 15 },
      { time: '11:30 AM', name: 'Advanced JavaScript Concepts', students: 12 },
      { time: '02:00 PM', name: 'Web Design Principles', students: 18 },
      { time: '04:30 PM', name: 'Database Management', students: 10 },
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    // Check if date is a moment object, if not convert it
    const momentDate = moment.isMoment(date) ? date : moment(date);
    return momentDate.format('MMMM D, YYYY');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/teacher/dashboard');
        console.log('Fetched dashboard data:', response.data);
        setDashboardData(prevData => ({
          ...prevData,
          ...response.data
        }));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p>Today's Date: {currentDate ? formatDate(currentDate) : 'Loading...'}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-md p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Total Classes</h4>
          <p className="text-3xl font-bold">{dashboardData.totalClasses}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg shadow-md p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Total Students</h4>
          <p className="text-3xl font-bold">{dashboardData.totalStudents}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Monthly Earnings</h4>
          <p className="text-3xl font-bold">${dashboardData.monthlyEarnings}</p>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold mb-4">
          Today's Classes - {currentDate.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h4>
        <div className="space-y-4">
          {dashboardData.todaysClasses.map((classItem, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{classItem.name}</p>
                <p className="text-sm text-gray-600">{classItem.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">{classItem.students} students</p>
                <button className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm hover:bg-indigo-600 transition-colors">
                  Start Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

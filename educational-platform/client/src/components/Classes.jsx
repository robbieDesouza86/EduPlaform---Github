import React, { useState } from 'react';

export default function Classes() {
  const [classes, setClasses] = useState([
    { id: 1, name: 'Introduction to React', students: 15, schedule: 'Mon, Wed 10:00 AM' },
    { id: 2, name: 'Advanced JavaScript', students: 12, schedule: 'Tue, Thu 2:00 PM' },
    { id: 3, name: 'Web Design Fundamentals', students: 18, schedule: 'Fri 9:00 AM' },
  ]);

  const [newClass, setNewClass] = useState({ name: '', schedule: '' });

  const handleInputChange = (e) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClasses([...classes, { ...newClass, id: classes.length + 1, students: 0 }]);
    setNewClass({ name: '', schedule: '' });
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Classes</h2>
      
      {/* Create new class form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Create New Class</h3>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            name="name"
            value={newClass.name}
            onChange={handleInputChange}
            placeholder="Class Name"
            className="flex-1 p-2 border rounded"
            required
          />
          <input
            type="text"
            name="schedule"
            value={newClass.schedule}
            onChange={handleInputChange}
            placeholder="Schedule (e.g., Mon, Wed 10:00 AM)"
            className="flex-1 p-2 border rounded"
            required
          />
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto">
            Create Class
          </button>
        </div>
      </form>
      
      {/* List of classes */}
      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4 border-b">Your Classes</h3>
        <ul>
          {classes.map((cls) => (
            <li key={cls.id} className="border-b last:border-b-0 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-semibold">{cls.name}</h4>
                <p className="text-sm text-gray-600">{cls.schedule}</p>
                <p className="text-sm text-gray-600">{cls.students} students</p>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 mt-2 sm:mt-0">
                View Details
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
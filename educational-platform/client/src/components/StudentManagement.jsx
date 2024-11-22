import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Messages from './Messages'; // Import the Messages component

const initialStudents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    dateOfBirth: '1995-05-15',
    gender: 'Male',
    nationality: 'American',
    hobbies: ['Reading', 'Swimming', 'Photography'],
    enrolledCourses: [
      { id: 1, title: 'Introduction to Mathematics', progress: 60 },
      { id: 2, title: 'Basic Science', progress: 30 },
    ],
    competencies: ['Problem Solving', 'Critical Thinking', 'Time Management'],
    learningGoals: ['Master calculus', 'Improve scientific writing'],
    notes: 'John is a dedicated student with a keen interest in STEM subjects.',
    school: 'Springfield High School',
    grade: '11th Grade',
    highestEducation: 'High School (In Progress)',
    employment: 'Part-time at Local Library',
  },
  // Add more sample students here
];

export default function StudentManagement() {
  const [students, setStudents] = useState(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, students]);

  const handleSearchResultClick = (student) => {
    setSelectedStudent(student);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Student Management</h2>
      <div className="flex space-x-6">
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {searchResults.map((student) => (
                  <li
                    key={student.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSearchResultClick(student)}
                  >
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.email}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ul className="mt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {students.map(student => (
              <li
                key={student.id}
                className={`p-2 cursor-pointer rounded-md transition-colors duration-200 ${
                  selectedStudent && selectedStudent.id === student.id
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-gray-600">{student.email}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          {selectedStudent ? (
            <StudentProfile student={selectedStudent} />
          ) : (
            <p className="text-center text-gray-500 mt-8">Select a student to view their profile.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentProfile({ student }) {
  const [notes, setNotes] = useState(student.notes);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = () => {
    // Here you would typically save the notes to your backend
    console.log('Saving notes:', notes);
    // You can add a visual feedback here, like a toast notification
    alert('Notes saved successfully!');
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img src={student.profilePicture} alt={student.name} className="w-24 h-24 rounded-full" />
        <div>
          <h2 className="text-2xl font-semibold">{student.name}</h2>
          <p className="text-gray-600">{student.email}</p>
          <button 
            onClick={() => setIsMessageModalOpen(true)} 
            className="text-blue-500 hover:underline"
          >
            Send Message
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
          <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
          <p><strong>Age:</strong> {calculateAge(student.dateOfBirth)}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Nationality:</strong> {student.nationality}</p>
          <p><strong>School:</strong> {student.school}</p>
          <p><strong>Grade:</strong> {student.grade}</p>
          <p><strong>Highest Education:</strong> {student.highestEducation}</p>
          <p><strong>Employment:</strong> {student.employment}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Hobbies & Interests</h3>
          <ul className="list-disc list-inside">
            {student.hobbies.map((hobby, index) => (
              <li key={index}>{hobby}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
        <ul className="space-y-2">
          {student.enrolledCourses.map(course => (
            <li key={course.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{course.title}</span>
              <span className="text-sm text-gray-600">Progress: {course.progress}%</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Competencies</h3>
        <div className="flex flex-wrap gap-2">
          {student.competencies.map((competency, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {competency}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Learning Goals</h3>
        <ul className="list-disc list-inside">
          {student.learningGoals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          className="w-full p-2 border rounded mb-2"
          rows="4"
        ></textarea>
        <button
          onClick={handleSaveNotes}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Save Notes
        </button>
      </div>

      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Message {student.name}</h2>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <Messages initialRecipient={student} />
          </div>
        </div>
      )}
    </div>
  );
}
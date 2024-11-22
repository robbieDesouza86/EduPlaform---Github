import React from 'react';

function CoursePopup({ course, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-indigo-900">{course.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <p className="text-indigo-600 mb-4">{course.description}</p>
          <h3 className="text-xl font-semibold text-indigo-800 mb-2">Course Details</h3>
          <ul className="list-disc list-inside text-indigo-600">
            <li>Duration: {course.duration}</li>
            <li>Level: {course.level}</li>
            <li>Instructor: {course.instructor}</li>
          </ul>
        </div>
        <div className="mt-6">
          <button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoursePopup;



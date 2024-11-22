import React from 'react';

function TeacherProfile({ teacher, onClose }) {
  if (!teacher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-indigo-900">{teacher.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 mr-4 flex items-center justify-center">
            <img 
              src={teacher.profilePicture ? `http://localhost:5000/uploads/${teacher.profilePicture}` : '/default-profile.jpg'} 
              alt={teacher.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">
              {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : 'No subjects specified'}
            </h3>
            <p className="text-indigo-600">{teacher.bio || 'Passionate about teaching and inspiring the next generation of learners.'}</p>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-indigo-800 mb-2">About Me</h4>
          <p className="text-gray-700">{teacher.about || 'Information not available.'}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-indigo-800 mb-2">Specialties</h4>
          <ul className="list-disc list-inside text-gray-700">
            {Array.isArray(teacher.specialties) && teacher.specialties.length > 0 ? (
              teacher.specialties.map((specialty, index) => (
                <li key={index}>{specialty}</li>
              ))
            ) : (
              <li>Information not available.</li>
            )}
          </ul>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-indigo-800 mb-2">Teaching Experience</h4>
          <p className="text-gray-700">{teacher.experience || 'Information not available.'}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-indigo-800 mb-2">Education</h4>
          <p className="text-gray-700">{teacher.education || 'Information not available.'}</p>
        </div>
        {teacher.promotionalVideo && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-indigo-800 mb-2">Promotional Video</h4>
            <div className="max-w-md mx-auto">
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src={teacher.promotionalVideo}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherProfile;

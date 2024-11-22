import React from 'react';

const sampleReviews = [
  { id: 1, studentName: 'Alice Smith', rating: 5, date: '2023-06-15', comment: 'Excellent teacher! Very patient and explains concepts clearly.' },
  { id: 2, studentName: 'Bob Johnson', rating: 4, date: '2023-06-10', comment: 'Great lessons, but sometimes moves a bit fast.' },
  { id: 3, studentName: 'Charlie Brown', rating: 5, date: '2023-06-05', comment: 'Fantastic teacher, helped me improve my skills significantly.' },
  { id: 4, studentName: 'Diana Ross', rating: 4, date: '2023-05-28', comment: 'Very knowledgeable and supportive. Highly recommend!' },
  { id: 5, studentName: 'Edward Norton', rating: 5, date: '2023-05-20', comment: 'Amazing teacher, makes learning fun and engaging.' },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function TeacherReviews() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
      <div className="space-y-6">
        {sampleReviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold">{review.studentName}</h3>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
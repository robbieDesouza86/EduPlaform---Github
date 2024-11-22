import React, { useState, useEffect } from 'react';

const courseTypes = ['Mathematics', 'Science', 'Language', 'Arts', 'History', 'Technology'];
const competencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const initialCourses = [
  {
    id: 1,
    title: 'Introduction to Mathematics',
    description: 'A beginner-friendly course covering basic math concepts.',
    type: 'Mathematics',
    competencyLevel: 'Beginner',
    classes: [
      { id: 1, title: 'Numbers and Counting', thumbnail: '', courseware: '' },
      { id: 2, title: 'Addition and Subtraction', thumbnail: '', courseware: '' },
    ],
    price: 99.99,
    enrollments: 5,
    mainPicture: '',
  },
];

export default function CourseManager() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState('course'); // 'course' or 'classes'
  const [expandedClassId, setExpandedClassId] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = courses.flatMap(course => {
      const courseMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const classMatches = course.classes.filter(cls => 
        cls.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const results = [];

      if (courseMatch) {
        results.push({ type: 'course', id: course.id, title: course.title });
      }

      classMatches.forEach(cls => {
        results.push({
          type: 'class',
          courseId: course.id,
          classId: cls.id,
          title: cls.title,
          courseTitle: course.title
        });
      });

      return results;
    });

    setSearchResults(results);
  }, [searchTerm, courses]);

  const handleSearchResultClick = (result) => {
    if (result.type === 'course') {
      setSelectedCourse(courses.find(course => course.id === result.id));
      setViewMode('course');
    } else {
      const course = courses.find(course => course.id === result.courseId);
      setSelectedCourse(course);
      setViewMode('classes');
      setExpandedClassId(result.classId);
    }
    setSearchTerm('');
  };

  const handleAddCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      title: `New Course ${courses.length + 1}`,
      description: 'Enter course description here',
      type: courseTypes[0],
      competencyLevel: competencyLevels[0],
      classes: [],
      price: 0,
      enrollments: 0,
      mainPicture: '',
    };
    setCourses([...courses, newCourse]);
    setSelectedCourse(newCourse);
  };

  const handleUpdateCourse = (updatedCourse) => {
    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    setSelectedCourse(updatedCourse);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
    setSelectedCourse(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Course Manager</h1>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search courses or classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {searchResults.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <li 
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSearchResultClick(result)}
              >
                {result.type === 'course' ? (
                  <span className="font-medium">{result.title} (Course)</span>
                ) : (
                  <span>
                    <span className="font-medium">{result.title}</span>
                    <span className="text-gray-500 ml-2">in {result.courseTitle}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex space-x-6">
        <div className="w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Courses</h2>
          <ul className="space-y-2 mb-4">
            {courses.map(course => (
              <li 
                key={course.id} 
                className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                  selectedCourse && selectedCourse.id === course.id
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <div className="font-medium">{course.title}</div>
                <div className="text-sm text-gray-600">{course.classes.length} classes</div>
                <div className="text-sm text-gray-600">${course.price}</div>
              </li>
            ))}
          </ul>
          <button 
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
            onClick={handleAddCourse}
          >
            Add New Course
          </button>
        </div>
        <div className="w-2/3">
          {selectedCourse ? (
            <div>
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded ${viewMode === 'course' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setViewMode('course')}
                >
                  Edit Course
                </button>
                <button
                  className={`px-4 py-2 rounded ${viewMode === 'classes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setViewMode('classes')}
                >
                  View Classes
                </button>
              </div>
              {viewMode === 'course' ? (
                <CourseForm 
                  course={selectedCourse} 
                  onUpdate={handleUpdateCourse}
                  onDelete={handleDeleteCourse}
                />
              ) : (
                <ClassList 
                  classes={selectedCourse.classes}
                  onUpdate={(updatedClasses) => handleUpdateCourse({...selectedCourse, classes: updatedClasses})}
                  expandedClassId={expandedClassId}
                  setExpandedClassId={setExpandedClassId}
                />
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8">Select a course to edit or create a new one.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseForm({ course, onUpdate, onDelete }) {
  const [formData, setFormData] = useState(course);

  useEffect(() => {
    setFormData(course);
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'main') {
          setFormData({ ...formData, mainPicture: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows="3"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Course Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {courseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Student Competency Level</label>
          <select
            name="competencyLevel"
            value={formData.competencyLevel}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {competencyLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Course Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          step="0.01"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Main Course Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'main')}
          className="w-full border rounded px-3 py-2"
        />
        {formData.mainPicture && (
          <img src={formData.mainPicture} alt="Course" className="mt-2 w-full max-h-40 object-cover rounded" />
        )}
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => onDelete(course.id)}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Delete Course
        </button>
      </div>
    </form>
  );
}

function ClassList({ classes, onUpdate, expandedClassId, setExpandedClassId }) {
  const handleClassChange = (index, field, value) => {
    const updatedClasses = classes.map((cls, i) => 
      i === index ? { ...cls, [field]: value } : cls
    );
    onUpdate(updatedClasses);
  };

  const handleDeleteClass = (index) => {
    const updatedClasses = classes.filter((_, i) => i !== index);
    onUpdate(updatedClasses);
  };

  const handleFileUpload = (e, type, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'thumbnail') {
          handleClassChange(index, 'thumbnail', reader.result);
        } else if (type === 'courseware') {
          handleClassChange(index, 'courseware', file.name);
        }
      };
      if (type === 'courseware') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Classes</h3>
      {classes.map((cls, index) => (
        <div key={cls.id} className="mb-4 p-4 border rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {cls.thumbnail && (
                <img src={cls.thumbnail} alt={cls.title} className="w-16 h-16 object-cover rounded" />
              )}
              <span className="font-medium">{cls.title}</span>
            </div>
            <button
              onClick={() => setExpandedClassId(expandedClassId === cls.id ? null : cls.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              {expandedClassId === cls.id ? '▲' : '▼'}
            </button>
          </div>
          {expandedClassId === cls.id && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block mb-1">Class Title</label>
                <input
                  type="text"
                  value={cls.title}
                  onChange={(e) => handleClassChange(index, 'title', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Class Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'thumbnail', index)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Courseware (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'courseware', index)}
                  className="w-full border rounded px-3 py-2"
                />
                {cls.courseware && <p className="text-sm text-gray-500 mt-1">File: {cls.courseware}</p>}
              </div>
              <button
                onClick={() => handleDeleteClass(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Class
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={() => onUpdate([...classes, { id: classes.length + 1, title: 'New Class', thumbnail: '', courseware: '' }])}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add New Class
      </button>
    </div>
  );
}
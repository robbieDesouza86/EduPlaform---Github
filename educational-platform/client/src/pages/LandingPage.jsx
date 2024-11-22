import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import TeacherProfile from '../components/TeacherProfile';
import CoursePopup from '../components/CoursePopup';
import Pagination from '../components/Pagination';
import SignUpPopup from '../components/SignUpPopup';
import LoginPopup from '../components/LoginPopup';

function LandingPage() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teacherPage, setTeacherPage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [isStudentHero, setIsStudentHero] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [signUpType, setSignUpType] = useState('student');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchTeachers = async (page = 1, limit = itemsPerPage, search = '') => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teacher/users?page=${page}&limit=${limit}&search=${search}`);
      setTeachers(response.data.teachers);
      setTotalTeachers(response.data.total);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Implement error handling here
    }
  };

  useEffect(() => {
    fetchTeachers(teacherPage, itemsPerPage, teacherSearch);
    fetchCourses();
  }, [teacherPage, teacherSearch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsStudentHero(prev => !prev);
        setIsTransitioning(false);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const StudentHero = () => (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="flex flex-col md:flex-row items-center justify-between md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0 text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Unlock Your Potential with EduPlatform</h1>
            <p className="text-lg md:text-xl mb-6">Discover a world of knowledge with our expert-led courses and cutting-edge learning tools.</p>
            <ul className="list-disc list-inside mb-6 text-lg">
              <li>Access to over 1000+ courses</li>
              <li>Learn at your own pace</li>
              <li>Interactive quizzes and assignments</li>
              <li>Earn certificates upon completion</li>
            </ul>
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
              <button 
                onClick={() => openSignUpPopup('student')}
                className="bg-white text-indigo-600 hover:bg-indigo-100 font-bold py-2 px-4 md:py-3 md:px-6 rounded-full transition duration-300 text-base md:text-lg w-full md:w-auto"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => scrollToSection('courses')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold py-2 px-4 md:py-3 md:px-6 rounded-full transition duration-300 text-base md:text-lg w-full md:w-auto"
              >
                Explore Courses
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img src="\images\Student Hero - Call to action picture.jpg" alt="Students learning" className="rounded-lg shadow-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  const TeacherHero = () => (
    <div className="w-full bg-gradient-to-r from-green-600 to-teal-600 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0 text-white md:pl-8"> {/* Added md:pl-8 for left padding on medium screens and up */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Empower Others Through Teaching</h1>
            <p className="text-lg md:text-xl mb-6">Join our community of educators and share your expertise with students worldwide.</p>
            <ul className="list-disc list-inside mb-6 text-lg">
              <li>Reach a global audience</li>
              <li>Flexible teaching schedule</li>
              <li>Earn income from your courses</li>
              <li>Access to teaching tools and resources</li>
            </ul>
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
              <button 
                onClick={() => openSignUpPopup('teacher')}
                className="bg-white text-green-600 hover:bg-green-100 font-bold py-2 px-4 md:py-3 md:px-6 rounded-full transition duration-300 text-base md:text-lg w-full md:w-auto"
              >
                Start Teaching Now
              </button>
              <button 
                onClick={() => scrollToSection('why-choose-us')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold py-2 px-4 md:py-3 md:px-6 rounded-full transition duration-300 text-base md:text-lg w-full md:w-auto"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="\images\Teacher Hero - CALL to action picture.jpg"
              alt="Teacher interacting with students online"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Filter and paginate teachers based on search input and current page
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(teacherSearch.toLowerCase()))
  );

  const totalPages = Math.ceil(totalTeachers / itemsPerPage);

  const handleTeacherPageChange = (newPage) => {
    setTeacherPage(newPage);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.description.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice((coursePage - 1) * itemsPerPage, coursePage * itemsPerPage);

  const openSignUpPopup = (type = 'student') => {
    console.log('Opening SignUp Popup:', type);
    setShowSignUpPopup(true);
    setShowLoginPopup(false);
    setSignUpType(type);
  };

  const closeSignUpPopup = () => {
    setShowSignUpPopup(false);
  };

  const openLoginPopup = () => {
    setShowLoginPopup(true);
    setShowSignUpPopup(false);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-indigo-800 text-white py-4 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">EduPlatform</Link>
          <div className="hidden md:flex space-x-4">
            <button onClick={() => scrollToSection('why-choose-us')} className="text-indigo-800 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded transition duration-300">Features</button>
            <button onClick={() => scrollToSection('teachers')} className="text-indigo-800 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded transition duration-300">Teachers</button>
            <button onClick={() => scrollToSection('courses')} className="text-indigo-800 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded transition duration-300">Courses</button>
            <button 
              className="text-indigo-800 hover:text-indigo-700 transition duration-300"
              onClick={openLoginPopup}
            >
              Log In
            </button>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
              onClick={() => openSignUpPopup('student')}
            >
              Sign Up
            </button>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="bg-white p-2 rounded-md"
            >
              <svg 
                className="w-6 h-6 text-indigo-800" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
            <button onClick={() => { scrollToSection('why-choose-us'); setIsMenuOpen(false); }} className="block text-indigo-800 hover:bg-indigo-100 px-4 py-3 w-full text-center border-b border-indigo-100 transition duration-300">Features</button>
            <button onClick={() => { scrollToSection('teachers'); setIsMenuOpen(false); }} className="block text-indigo-800 hover:bg-indigo-100 px-4 py-3 w-full text-center border-b border-indigo-100 transition duration-300">Teachers</button>
            <button onClick={() => { scrollToSection('courses'); setIsMenuOpen(false); }} className="block text-indigo-800 hover:bg-indigo-100 px-4 py-3 w-full text-center border-b border-indigo-100 transition duration-300">Courses</button>
            <button onClick={() => { setIsMenuOpen(false); openLoginPopup(); }} className="block text-indigo-800 hover:bg-indigo-100 px-4 py-3 w-full text-center border-b border-indigo-100 transition duration-300">Log In</button>
            <button onClick={() => { setIsMenuOpen(false); openSignUpPopup('student'); }} className="block bg-green-500 text-white px-4 py-3 w-full text-center hover:bg-green-600 transition duration-300">Sign Up</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow mt-16 absolute w-full">
        {/* Hero Carousel */}
        <div className="relative w-full ">
          <div className={`transition-opacity duration-500 ${isStudentHero ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <StudentHero />
          </div>
          <div className={`absolute top-0 left-0 right-0 transition-opacity duration-500 ${!isStudentHero ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <TeacherHero />
          </div>
        </div>

        {/* Combined Why Choose Us Section */}
        <div id="why-choose-us" className="w-full bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Why Choose EduPlatform</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Student Features */}
              <div>
                <h3 className="text-2xl font-bold text-indigo-600 mb-6">For Students</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Expert-Led Courses</h4>
                      <p className="text-gray-600">Learn from industry professionals across various subjects.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Flexible Learning</h4>
                      <p className="text-gray-600">Study at your own pace with on-demand video lessons.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Interactive Learning</h4>
                      <p className="text-gray-600">Engage with peers and instructors through forums and live sessions.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Career Advancement</h4>
                      <p className="text-gray-600">Gain skills and certifications to boost your professional growth.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => openSignUpPopup('student')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
                  >
                    Start Learning
                  </button>
                </div>
              </div>

              {/* Teacher Features */}
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-6">For Teachers</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Global Reach</h4>
                      <p className="text-gray-600">Share your expertise with students worldwide.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Flexible Schedule</h4>
                      <p className="text-gray-600">Create and manage your courses on your own time.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Comprehensive Tools</h4>
                      <p className="text-gray-600">Access advanced course creation and analytics tools.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold">Community Support</h4>
                      <p className="text-gray-600">Join a network of educators for collaboration and growth.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => openSignUpPopup('teacher')}
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300"
                  >
                    Start Teaching
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Section */}
        <div id="teachers" className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-indigo-800 mb-8 text-center">Our Expert Teachers</h2>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search teachers..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                  <img 
                    src={teacher.profilePicture ? `http://localhost:5000/uploads/${teacher.profilePicture}` : '/default-profile.jpg'} 
                    alt={teacher.name} 
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">{teacher.name}</h3>
                  <p className="text-gray-600 text-center mb-4">
                    {teacher.subjects && teacher.subjects.join(', ')}
                  </p>
                  <button
                    onClick={() => setSelectedTeacher(teacher.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={teacherPage}
              totalPages={Math.ceil(totalTeachers / itemsPerPage)}
              onPageChange={setTeacherPage}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full bg-indigo-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl mb-8">Join thousands of students already learning on EduPlatform</p>
            <button 
              className="bg-white text-indigo-600 hover:bg-indigo-100 font-bold py-3 px-8 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => openSignUpPopup('student')}
            >
              Sign Up Now
            </button>
          </div>
        </div>

        {/* Courses Section */}
        <div id="courses" className="w-full py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">Our Courses</h2>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold mb-3 text-indigo-800">{course.title}</h3>
                  <p className="text-indigo-600 mb-4">{course.description}</p>
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    Learn More
                  </button>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={coursePage}
              totalPages={Math.ceil(filteredCourses.length / itemsPerPage)}
              onPageChange={setCoursePage}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-indigo-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About Us</h3>
                <p>EduPlatform is dedicated to providing high-quality online education to learners worldwide.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul>
                  <li><a href="#" className="hover:text-indigo-300">Home</a></li>
                  <li><a href="#courses" className="hover:text-indigo-300">Courses</a></li>
                  <li><a href="#teachers" className="hover:text-indigo-300">Teachers</a></li>
                  <li><a href="#" className="hover:text-indigo-300">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p>Email: info@eduplatform.com</p>
                <p>Phone: (123) 456-7890</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-indigo-300">Facebook</a>
                  <a href="#" className="hover:text-indigo-300">Twitter</a>
                  <a href="#" className="hover:text-indigo-300">LinkedIn</a>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p>&copy; 2023 EduPlatform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {selectedTeacher && (
        <TeacherProfile 
          teacher={teachers.find(t => t.id === selectedTeacher)} 
          onClose={() => setSelectedTeacher(null)} 
        />
      )}

      {selectedCourse && (
        <CoursePopup
          course={courses.find(c => c.id === selectedCourse)}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {showSignUpPopup && (
        <SignUpPopup
          onClose={closeSignUpPopup}
          openLoginPopup={openLoginPopup}
          initialTab={signUpType}
        />
      )}
      {showLoginPopup && (
        <LoginPopup
          onClose={closeLoginPopup}
          openSignUpPopup={() => openSignUpPopup('teacher')}
        />
      )}
    </div>
  );
}

export default LandingPage;
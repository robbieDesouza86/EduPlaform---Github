import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { AiOutlineClose, AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  // Add more countries as needed
];



const subjects = [
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'english', label: 'English' },
  // Add more subjects as needed
];



const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];



function SignUpPopup({ onClose, openLoginPopup }) {
  const navigate = useNavigate();
  
  const [isStudent, setIsStudent] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: null,
    gender: null,
    nationality: null,
    subjects: [],
    profilePicture: null,
    email: '',
    password: '',
    confirmPassword: '',
  });



  const [passwordMatch, setPasswordMatch] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'confirmPassword' || name === 'password') {
      setPasswordMatch(formData.password === value || formData.confirmPassword === value);
    }
  };


  const handleDateChange = (date) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordMatch) {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'dateOfBirth' && formData[key]) {
          formDataToSend.append(key, formData[key].toISOString());
        } else if (key === 'gender' || key === 'nationality') {
          formDataToSend.append(key, formData[key]?.value || '');
        } else if (key === 'subjects') {
          formDataToSend.append(key, JSON.stringify(formData[key].map(subject => subject.value)));
        } else if (key !== 'confirmPassword') {
          formDataToSend.append(key, formData[key]);
        }
      }
      formDataToSend.append('role', isStudent ? 'student' : 'teacher');

      try {
        const response = await axios.post('http://localhost:5000/api/auth/signup', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Check if the response contains token and user data
        if (response.data.token && response.data.user) {
          // Store token and user data in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          setSuccess('Account created successfully! Redirecting to dashboard...');
          
          setTimeout(() => {
            onClose();
            if (isStudent) {
              navigate('/student-dashboard');
            } else {
              navigate('/teacher-dashboard');
            }
          }, 2000);
        } else {
          // If token or user data is missing, throw an error
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Signup error:', error);
        setError(error.response?.data?.message || 'An error occurred during signup');
      }
    }
  };



  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative mt-16 md:mt-0">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up as {isStudent ? 'Student' : 'Teacher'}</h2>
        <div className="mb-4 flex justify-center">
          <button
            className={`mr-2 px-4 py-2 rounded ${isStudent ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIsStudent(true)}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 rounded ${!isStudent ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIsStudent(false)}
          >
            Teacher
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <Select
                id="nationality"
                name="nationality"
                options={countries}
                onChange={(selectedOption) => handleSelectChange('nationality', selectedOption)}
                placeholder="Nationality"
                className="w-full"
                required
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <DatePicker
                id="dateOfBirth"
                name="dateOfBirth"
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Date of Birth"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <Select
                id="gender"
                name="gender"
                options={genders}
                onChange={(selectedOption) => handleSelectChange('gender', selectedOption)}
                placeholder="Gender"
                className="w-full"
                required
              />
            </div>
          </div>
          {!isStudent && (
            <Select
              id="subjects"
              name="subjects"
              options={subjects}
              isMulti
              onChange={(selectedOptions) => handleSelectChange('subjects', selectedOptions)}
              placeholder="Subjects"
              className="w-full"
              required
            />
          )}
          <div className="w-full p-2 border rounded flex items-center justify-center cursor-pointer" onClick={handleUploadClick}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <AiOutlineUser size={40} className="text-gray-400" />
              </div>
            )}
            <span className="ml-2 text-blue-500">Upload Profile Picture</span>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex space-x-2">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-1/2 p-2 border rounded ${passwordMatch ? 'border-green-500' : 'border-red-500'}`}
              required
            />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-1/2 p-2 border rounded ${passwordMatch ? 'border-green-500' : 'border-red-500'}`}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <button onClick={openLoginPopup} className="text-sm text-blue-500 hover:underline">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}


export default SignUpPopup;
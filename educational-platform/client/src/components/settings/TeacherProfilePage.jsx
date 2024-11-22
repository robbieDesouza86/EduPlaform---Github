import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const profileStyles = [
  { id: 1, name: 'Classic', color: 'bg-gray-200' },
  { id: 2, name: 'Modern', color: 'bg-blue-200' },
  { id: 3, name: 'Minimalist', color: 'bg-white' },
  { id: 4, name: 'Colorful', color: 'bg-gradient-to-r from-purple-200 to-pink-200' },
  { id: 5, name: 'Professional', color: 'bg-indigo-200' },
];


const studentAgeGroups = ['Child', 'Teenager', 'Adult', 'Child & Teenager', 'Teenager & Adult', 'All'];
const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Native', 'Fluent', 'Beginner & Intermediate', 'Intermediate & Advanced', 'Advanced & Native', 'Fluent & Native', 'All'];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

const teachingStyleOptions = [
  "Gentle and patient", "Lively and warm", "Good at guiding",
"Humorous", "Focus on pronunciation", "Good at expanding",
"Attention to detail", "Focus on grammar", "Encouraging",
"Supportive", "Adaptable", "Creative", "Empathetic",
"Enthusiastic", "Passionate", "Approachable", "Inspiring",
"Friendly", "Organized", "Dedicated", "Resourceful",
"Observant", "Flexible", "Motivating", "Articulate",
"Curious", "Trustworthy", "Respectful", "Non-judgmental",
"Dynamic", "Analytical", "Intuitive", "Insightful",
"Communicative", "Problem-solver", "Reflective", "Patient listener",
"Positive", "Resilient", "Open-minded", "Detail-oriented",
"Visionary", "Strategic thinker", "Caring", "Persuasive",
"Disciplined", "Self-motivated", "Collaborative", "Tech-savvy",
  // ... add all the teaching style options here
];

const languageOptions = [
  "English", "Spanish", "French", "German", "Italian",
"Portuguese", "Chinese", "Japanese", "Korean", "Russian",
"Arabic", "Hindi", "Bengali", "Turkish", "Vietnamese",
"Thai", "Dutch", "Swedish", "Norwegian", "Danish",
"Finnish", "Greek", "Hebrew", "Hungarian", "Czech",
"Polish", "Romanian", "Indonesian", "Malay", "Filipino",
"Ukrainian", "Swahili", "Serbian", "Croatian", "Slovak",
"Bulgarian", "Catalan", "Lithuanian", "Latvian", "Estonian",
"Persian (Farsi)", "Tamil", "Telugu", "Malayalam", "Urdu",
"Arabic (Egyptian)", "Arabic (Levantine)", "Chinese (Cantonese)",
"Chinese (Mandarin)", "Chinese (Shanghainese)", "Japanese (Hiragana)",
"Japanese (Katakana)", "Korean (Hangul)", "Russian (Cyrillic)",
"Vietnamese (Latin script)", "Scottish Gaelic", "Welsh",
"Basque", "Irish", "Mongolian", "Icelandic", "Albanian",
  // ... add all the language options here
];

const interestOptions = [
  "Reading", "Writing", "Painting", "Drawing", "Cooking",
"Baking", "Gardening", "Hiking", "Camping", "Fishing",
"Swimming", "Cycling", "Running", "Jogging", "Yoga",
"Meditation", "Photography", "Traveling", "Birdwatching",
"Collecting stamps", "Collecting coins", "Playing chess", "Playing board games",
"Playing cards", "Knitting", "Crocheting", "Sewing",
"Embroidery", "DIY crafts", "Scrapbooking", "Playing musical instruments",
"Singing", "Dancing", "Listening to music", "Watching movies",
"Watching TV shows", "Playing video games", "Blogging", "Journaling",
"Learning new languages", "Volunteering", "Playing soccer",
"Playing basketball", "Playing tennis", "Playing badminton",
"Skateboarding", "Surfing", "Snowboarding", "Skiing",
"Rock climbing", "Kayaking", "Canoeing", "Bowling",
"Archery", "Martial arts", "Boxing", "Pilates",
"Weightlifting", "Fitness training", "Ice skating", "Rollerblading",
"Horseback riding", "Astronomy", "Playing poker", "Solving puzzles",
"Learning origami", "Woodworking", "Metalworking", "Pottery",
"Making jewelry", "Acting", "Stand-up comedy", "Magic tricks",
"Collecting action figures", "Antique collecting", "Car restoration",
"Home brewing", "Wine tasting", "Stargazing", "Kite flying",
"Calligraphy", "Model building", "Leather crafting", "Candle making",
"Soap making", "Flower arranging", "Bonsai growing", "Nail art",
"Fashion designing", "Makeup artistry", "Bodybuilding", "Hiking",
"Orienteering", "Geocaching", "Dog training", "Pet care",
"Juggling", "Memorization games", "Robotics",
  // ... add all the interest options here
];


const subjectOptions = [
  "English Language", "Mathematics", "Science", "Social Studies", "History",
"Geography", "Art", "Music", "Physical Education", "Health Education",
"Basic Computing", "Life Skills", "Foreign Languages", "Civics", "Environmental Science",
"Creative Writing", "Reading Comprehension", "Basic Economics", "Drama", "Handwriting",
"Cooking/Nutrition", "Crafts/Arts and Crafts", "Public Speaking",
"Advanced Mathematics", "Biology", "Chemistry", "Physics", "World History",
"Cultural Studies", "Information Technology", "Business Studies", "Statistics", "Psychology",
"Sociology", "Philosophy", "Media Studies", "World Geography", "Music Theory",
"Art History", "Creative Arts", "Economics", "Physical Science", "Environmental Studies",
"Drama/Theater Arts", "Basic Programming", "Calculus", "Advanced Biology",
"Organic Chemistry", "Advanced Physics", "Statistics and Probability",
"Advanced Computer Science", "International Relations", "Advanced Literature",
"Advanced Psychology", "Ethics", "Neuroscience", "Advanced Economics",
"Philosophy of Science", "Astrophysics", "Environmental Science",
"Artificial Intelligence and Machine Learning", "Human Geography",
"Cybersecurity", "Game Theory", "Genetics", "International Law",
"Biochemistry", "Data Science", "Creative Writing (Advanced Techniques)",
"Public Administration", "Advanced Foreign Languages", "Advanced Statistics", "Robotics",
"Cognitive Science",
  // ... add all the subject options here
];

const DynamicMultiSelect = ({ options, value, onChange, placeholder }) => (
  <Select
    isMulti
    options={options.map(opt => ({ value: opt, label: opt }))}
    value={value.map(v => ({ value: v, label: v }))}
    onChange={selected => onChange(selected ? selected.map(s => s.value) : [])}
    placeholder={placeholder}
    className="w-full"
  />
);

const TeacherProfilePage = ({ userData, selectedUserName, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dateOfBirth: null,
    gender: '',
    nationality: '',
    title: '',
    education: [],
    workExperience: [],
    certificates: [],
    subjects: [],
    interests: [],
    languages: [],
    profilePicture: null,
    introductionVideo: null,
    introductionWriteup: '',
    studentAgeGroup: '',
    studentProficiency: '',
    teachingStyles: [],
    selectedStyle: '1',
  });


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [previewUrls, setPreviewUrls] = useState({
    profilePicture: null,
    introductionVideo: null
  });

  useEffect(() => {
    if (userData) {
      setProfileData(prevData => ({
        ...prevData,
        ...userData,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        gender: userData.gender || '',
        nationality: userData.nationality || '',
        studentAgeGroup: userData.studentAgeGroup || '',
        studentProficiency: userData.studentProficiency || '',
        education: Array.isArray(userData.education) ? userData.education : [],
        workExperience: Array.isArray(userData.workExperience) ? userData.workExperience : [],
        certificates: Array.isArray(userData.certificates) ? userData.certificates : [],
        subjects: Array.isArray(userData.subjects) ? userData.subjects : [],
        interests: Array.isArray(userData.interests) ? userData.interests : [],
        languages: Array.isArray(userData.languages) ? userData.languages : [],
        teachingStyles: Array.isArray(userData.teachingStyles) ? userData.teachingStyles : [],
      }));
      setLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [userData]);

  useEffect(() => {
    if (profileData.profilePicture) {
      setPreviewUrls(prev => ({ ...prev, profilePicture: `http://localhost:5000/uploads/${profileData.profilePicture}` }));
    }
    if (profileData.introductionVideo) {
      setPreviewUrls(prev => ({ ...prev, introductionVideo: `http://localhost:5000/uploads/${profileData.introductionVideo}` }));
    }
  }, [profileData.profilePicture, profileData.introductionVideo]);

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
          gender: response.data.gender || '',
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

  const handleDateChange = (date) => {
    setProfileData({ ...profileData, dateOfBirth: date });
  };

  const handleSelectChange = (name, selectedOption) => {
    setProfileData(prevData => ({ ...prevData, [name]: selectedOption.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prevData => ({
        ...prevData,
        [e.target.name]: file
      }));
      
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [e.target.name]: previewUrl }));
    }
  };

  const handleObjectArrayInputChange = (e, index, field, subfield) => {
    const updatedArray = [...profileData[field]];
    updatedArray[index][subfield] = e.target.value;
    setProfileData(prevData => ({ ...prevData, [field]: updatedArray }));
  };

  const handleArrayInputChange = (e, index, field) => {
    const updatedArray = [...profileData[field]];
    updatedArray[index] = e.target.value;
    setProfileData(prevData => ({ ...prevData, [field]: updatedArray }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setProfileData(prevData => {
      const newArray = [...prevData[field]];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prevData, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    const newItem = {
      education: { institution: '', degree: '', startYear: '', endYear: '' },
      workExperience: { company: '', jobTitle: '', startYear: '', endYear: '' },
      certificates: { institution: '', name: '', year: '' },
    }[field] || ''; // Use an empty string as default

    setProfileData(prevData => ({
      ...prevData,
      [field]: Array.isArray(prevData[field]) 
        ? [...prevData[field], newItem]
        : [...(prevData[field] || []), newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();

      // Add basic info
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('title', profileData.title);
      formData.append('gender', profileData.gender);
      formData.append('nationality', profileData.nationality);
      
      // Handle dateOfBirth properly
      if (profileData.dateOfBirth instanceof Date) {
        formData.append('dateOfBirth', profileData.dateOfBirth.toISOString().split('T')[0]);
      } else if (typeof profileData.dateOfBirth === 'string') {
        formData.append('dateOfBirth', profileData.dateOfBirth);
      } else {
        formData.append('dateOfBirth', '');
      }
      
      formData.append('introductionWriteup', profileData.introductionWriteup);

      // Add arrays as JSON strings
      ['education', 'workExperience', 'certificates', 'subjects', 'interests', 'languages', 'teachingStyles'].forEach(field => {
        formData.append(field, JSON.stringify(profileData[field] || []));
      });

      // Add other fields
      formData.append('studentAgeGroup', profileData.studentAgeGroup);
      formData.append('studentProficiency', profileData.studentProficiency);

      // Handle file uploads
      if (profileData.profilePicture instanceof File) {
        formData.append('profilePicture', profileData.profilePicture);
      }
      if (profileData.introductionVideo instanceof File) {
        formData.append('introductionVideo', profileData.introductionVideo);
      }

      const response = await axios.put('http://localhost:5000/api/teacher/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profile updated:', response.data);
      alert('Profile updated successfully!');

      // Call the onProfileUpdate function to refresh the top bar
      if (onProfileUpdate) {
        onProfileUpdate();
      }

    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const renderObjectArrayInputs = (field, label, subfields) => {
    if (!profileData[field] || !Array.isArray(profileData[field])) {
      console.error(`Invalid data for ${field}: `, profileData[field]);
      return null;
    }

    return (
      <div>
        <label className="block mb-2 font-semibold">{label}</label>
        {profileData[field].map((item, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            {subfields.map((subfield) => (
              <div key={subfield} className="mb-2">
                <label className="block mb-1">
                  {subfield === 'degree' ? 'Education Level' :
                   subfield === 'jobTitle' ? 'Job Title' :
                   subfield === 'name' && field === 'certificates' ? 'Name of Certificate/Diploma/Degree' :
                   subfield.charAt(0).toUpperCase() + subfield.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                {subfield.includes('Year') ? (
                  <select
                    value={item[subfield] || ''}
                    onChange={(e) => handleObjectArrayInputChange(e, index, field, subfield)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={item[subfield] || ''}
                    onChange={(e) => handleObjectArrayInputChange(e, index, field, subfield)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeArrayItem(index, field)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300 mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-300"
        >
          Add {label}
        </button>
      </div>
    );
  };

  const renderArrayInputs = (field, label) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{label}</h3>
        {profileData[field].map((item, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg relative">
            {Object.keys(item).map(key => (
              <div key={key} className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {key.includes('Year') ? (
                  <select
                    value={item[key]}
                    onChange={(e) => handleArrayChange(field, index, key, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Select Year</option>
                    {key === 'endYear' && <option value="Present">Present</option>}
                    {years.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={item[key]}
                    onChange={(e) => handleArrayChange(field, index, key, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add {label}
        </button>
      </div>
    );
  };

  const tabs = [
    { name: 'Basic Info', icon: '👤' },
    { name: 'Qualifications', icon: '🎓' },
    { name: 'Teaching', icon: '📚' },
    { name: 'Media', icon: '🖼️' },
  ];

  const handleMultiSelectChange = (field, selectedOptions) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: selectedOptions
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6">Teacher Profile Page</h2>
      {selectedUserName && (
        <p className="mb-4 font-semibold">Currently editing: {selectedUserName}</p>
      )}
      <div className="grid grid-cols-1 gap-6">
        <div>
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
                  <label className="block mb-2 font-semibold">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={profileData.title || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender || ''}
                    onChange={(e) => handleSelectChange('gender', { value: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Nationality</label>
                  <select
                    name="nationality"
                    value={profileData.nationality || ''}
                    onChange={(e) => handleSelectChange('nationality', { value: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Nationality</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Date of Birth</label>
                  <DatePicker
                    selected={profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null}
                    onChange={handleDateChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Introduction Write-up</label>
                  <textarea
                    name="introductionWriteup"
                    value={profileData.introductionWriteup || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                </div>
              </form>
            </TabPanel>

            <TabPanel>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Education</h3>
                  {profileData.education.map((edu, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Year</label>
                          <select
                            value={edu.startYear}
                            onChange={(e) => handleArrayChange('education', index, 'startYear', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="">Select Year</option>
                            {years.map(year => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Year</label>
                          <select
                            value={edu.endYear}
                            onChange={(e) => handleArrayChange('education', index, 'endYear', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="">Select Year</option>
                            <option value="Present">Present</option>
                            {years.map(year => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('education', index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('education')}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Education
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                  {profileData.workExperience.map((exp, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleArrayChange('workExperience', index, 'company', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Job Title</label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => handleArrayChange('workExperience', index, 'jobTitle', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Year</label>
                          <select
                            value={exp.startYear}
                            onChange={(e) => handleArrayChange('workExperience', index, 'startYear', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="">Select Year</option>
                            {years.map(year => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Year</label>
                          <select
                            value={exp.endYear}
                            onChange={(e) => handleArrayChange('workExperience', index, 'endYear', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="">Select Year</option>
                            <option value="Present">Present</option>
                            {years.map(year => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('workExperience', index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('workExperience')}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Work Experience
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Certificates/Diplomas/Degrees</h3>
                  {profileData.certificates.map((cert, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg relative mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <input
                            type="text"
                            value={cert.institution}
                            onChange={(e) => handleArrayChange('certificates', index, 'institution', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name of Certificate/Diploma/Degree</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => handleArrayChange('certificates', index, 'name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Year</label>
                          <select
                            value={cert.year}
                            onChange={(e) => handleArrayChange('certificates', index, 'year', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="">Select Year</option>
                            {years.map(year => (
                              <option key={year} value={year.toString()}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('certificates', index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('certificates')}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Certificate/Diploma/Degree
                  </button>
                </div>
              </form>
            </TabPanel>

            <TabPanel>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold">Subjects</label>
                  <DynamicMultiSelect
                    options={subjectOptions}
                    value={profileData.subjects}
                    onChange={(selectedOptions) => handleMultiSelectChange('subjects', selectedOptions)}
                    placeholder="Select subjects..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Interests</label>
                  <DynamicMultiSelect
                    options={interestOptions}
                    value={profileData.interests}
                    onChange={(selectedOptions) => handleMultiSelectChange('interests', selectedOptions)}
                    placeholder="Select interests..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Languages</label>
                  <DynamicMultiSelect
                    options={languageOptions}
                    value={profileData.languages}
                    onChange={(selectedOptions) => handleMultiSelectChange('languages', selectedOptions)}
                    placeholder="Select languages..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Teaching Styles</label>
                  <DynamicMultiSelect
                    options={teachingStyleOptions}
                    value={profileData.teachingStyles}
                    onChange={(selectedOptions) => handleMultiSelectChange('teachingStyles', selectedOptions)}
                    placeholder="Select teaching styles..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Student Age Group</label>
                  <select
                    name="studentAgeGroup"
                    value={profileData.studentAgeGroup || ''}
                    onChange={(e) => handleSelectChange('studentAgeGroup', { value: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Student Age Group</option>
                    {studentAgeGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Student Proficiency</label>
                  <select
                    name="studentProficiency"
                    value={profileData.studentProficiency || ''}
                    onChange={(e) => handleSelectChange('studentProficiency', { value: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Proficiency Level</option>
                    {proficiencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </TabPanel>

            <TabPanel>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-full md:w-1/2">
                    <label className="block mb-2 font-semibold text-gray-700">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center justify-center px-4 py-2 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                        <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                        </svg>
                        <span className="ml-2 text-sm leading-normal">Select Image</span>
                        <input
                          type="file"
                          name="profilePicture"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        {profileData.profilePicture instanceof File 
                          ? profileData.profilePicture.name 
                          : 'No file selected'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    {previewUrls.profilePicture && (
                      <img 
                        src={previewUrls.profilePicture} 
                        alt="Profile Picture" 
                        className="w-full h-64 object-cover rounded-lg shadow-md" 
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-full md:w-1/2">
                    <label className="block mb-2 font-semibold text-gray-700">Introduction Video</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center justify-center px-4 py-2 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                        <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                        </svg>
                        <span className="ml-2 text-sm leading-normal">Select Video</span>
                        <input
                          type="file"
                          name="introductionVideo"
                          onChange={handleFileChange}
                          accept="video/*"
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        {profileData.introductionVideo instanceof File 
                          ? profileData.introductionVideo.name 
                          : 'No file selected'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    {previewUrls.introductionVideo && (
                      <video 
                        src={previewUrls.introductionVideo} 
                        className="w-full h-64 object-cover rounded-lg shadow-md" 
                        controls 
                      />
                    )}
                  </div>
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
      </div>
    </div>
  );
};

export default TeacherProfilePage;
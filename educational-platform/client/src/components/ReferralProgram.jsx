import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install this package: npm install uuid

const initialReferrals = [
  { id: 1, name: 'Alice Smith', status: 'Registered', date: '2023-05-15', reward: 50, type: 'Teacher', platform: 'Facebook', clicks: 5, shares: 2 },
  { id: 2, name: 'Bob Johnson', status: 'Completed Course', date: '2023-04-20', reward: 100, type: 'Student', platform: 'Twitter', clicks: 8, shares: 3 },
  { id: 3, name: 'Charlie Brown', status: 'Pending', date: '2023-06-01', reward: 0, type: 'Teacher', platform: 'LinkedIn', clicks: 3, shares: 1 },
  { id: 4, name: 'Diana Ross', status: 'Registered', date: '2023-05-28', reward: 50, type: 'Teacher', platform: 'Facebook', clicks: 6, shares: 2 },
  { id: 5, name: 'Edward Norton', status: 'Completed Course', date: '2023-05-10', reward: 100, type: 'Student', platform: 'Twitter', clicks: 10, shares: 4 },
];

// Simulated current user data
const currentUser = {
  id: uuidv4(),
  name: 'John Doe',
  type: 'Teacher'
};

export default function ReferralProgram() {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [totalRewards, setTotalRewards] = useState(0);
  const [successfulTeacherReferrals, setSuccessfulTeacherReferrals] = useState(0);
  const [copiedLink, setCopiedLink] = useState('');

  // Generate unique referral link based on user's name and ID
  const generateUniqueLink = (user) => {
    const namePart = user.name.toLowerCase().replace(/\s+/g, '-');
    const uniquePart = user.id.slice(0, 8);
    return `https://eduplatform.com/ref/${namePart}-${uniquePart}`;
  };

  const referralLink = generateUniqueLink(currentUser);

  useEffect(() => {
    const total = referrals.reduce((sum, referral) => sum + referral.reward, 0);
    setTotalRewards(total);

    const successfulTeachers = referrals.filter(r => r.type === 'Teacher' && r.status === 'Registered').length;
    setSuccessfulTeacherReferrals(successfulTeachers);
  }, [referrals]);

  const copyReferralLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const shareOnSocialMedia = (platform, link) => {
    let url;
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Join me on EduPlatform!')}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(link)}&title=${encodeURIComponent('Join me on EduPlatform!')}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Join me on EduPlatform! ${link}`)}`;
        break;
      case 'wechat':
        copyReferralLink(link);
        alert('Link copied! Please paste it into WeChat to share.');
        return;
      default:
        return;
    }
    window.open(url, '_blank');
    
    // Simulate tracking share
    setReferrals(prev => prev.map(r => r.type === currentUser.type ? {...r, shares: r.shares + 1} : r));
  };

  const freeMonths = Math.floor(successfulTeacherReferrals / 10);

  const successfulTeacherCount = referrals.filter(r => r.type === 'Teacher' && r.status === 'Registered').length;
  const successfulStudentCount = referrals.filter(r => r.type === 'Student' && r.status === 'Completed Course').length;

  const ReferralLinkSection = ({ title, link }) => (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={link}
          readOnly
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => copyReferralLink(link)}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            copiedLink === link ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {copiedLink === link ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex items-center space-x-2 mb-4 flex-wrap">
        <button onClick={() => shareOnSocialMedia('facebook', link)} className="bg-blue-600 text-white px-4 py-2 rounded m-1">Facebook</button>
        <button onClick={() => shareOnSocialMedia('twitter', link)} className="bg-blue-400 text-white px-4 py-2 rounded m-1">Twitter</button>
        <button onClick={() => shareOnSocialMedia('linkedin', link)} className="bg-blue-700 text-white px-4 py-2 rounded m-1">LinkedIn</button>
        <button onClick={() => shareOnSocialMedia('whatsapp', link)} className="bg-green-500 text-white px-4 py-2 rounded m-1">WhatsApp</button>
        <button onClick={() => shareOnSocialMedia('wechat', link)} className="bg-green-600 text-white px-4 py-2 rounded m-1">WeChat</button>
      </div>
    </div>
  );

  const platformStats = referrals.reduce((acc, referral) => {
    acc[referral.platform] = (acc[referral.platform] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Referral Program</h2>

      <div className="mb-8">
        <ReferralLinkSection 
          title="Your Unique Referral Link" 
          link={referralLink}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Referral Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-lg font-medium">Total Referrals</p>
            <p className="text-3xl font-bold">{referrals.length}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-lg font-medium">Successful Teacher Referrals</p>
            <p className="text-3xl font-bold">{successfulTeacherReferrals}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-lg font-medium">Free Months Earned</p>
            <p className="text-3xl font-bold text-green-600">{freeMonths}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-lg font-medium">Total Rewards</p>
            <p className="text-3xl font-bold text-green-600">${totalRewards}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Referral Performance</h3>
        <div className="flex items-end space-x-4 h-64 border-b border-l">
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 w-16 transition-all duration-500 ease-in-out" style={{height: `${(successfulTeacherCount / referrals.length) * 100}%`}}></div>
            <p className="mt-2">Teachers</p>
            <p className="font-bold">{successfulTeacherCount}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-500 w-16 transition-all duration-500 ease-in-out" style={{height: `${(successfulStudentCount / referrals.length) * 100}%`}}></div>
            <p className="mt-2">Students</p>
            <p className="font-bold">{successfulStudentCount}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Platform Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(platformStats).map(([platform, count]) => (
            <div key={platform} className="bg-gray-100 p-4 rounded">
              <p className="text-lg font-medium">{platform}</p>
              <p className="text-3xl font-bold">{count} referrals</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Referrals</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Platform</th>
                <th className="p-2 text-right">Clicks</th>
                <th className="p-2 text-right">Shares</th>
                <th className="p-2 text-right">Reward</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(referral => (
                <tr key={referral.id} className="border-b">
                  <td className="p-2">{referral.name}</td>
                  <td className="p-2">{referral.type}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      referral.status === 'Completed Course' ? 'bg-green-200 text-green-800' :
                      referral.status === 'Registered' ? 'bg-blue-200 text-blue-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="p-2">{referral.date}</td>
                  <td className="p-2">{referral.platform}</td>
                  <td className="p-2 text-right">{referral.clicks}</td>
                  <td className="p-2 text-right">{referral.shares}</td>
                  <td className="p-2 text-right">${referral.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
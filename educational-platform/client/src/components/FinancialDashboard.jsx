import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const initialEarnings = [
  { date: '2023-01-01', amount: 500 },
  { date: '2023-02-01', amount: 750 },
  { date: '2023-03-01', amount: 600 },
  { date: '2023-04-01', amount: 800 },
  { date: '2023-05-01', amount: 950 },
  { date: '2023-06-01', amount: 1100 },
];

const initialSubscriptions = [
  { id: 1, studentName: 'Alice Johnson', plan: 'Monthly', amount: 50, lastPayment: '2023-05-15' },
  { id: 2, studentName: 'Bob Smith', plan: 'Quarterly', amount: 135, lastPayment: '2023-04-01' },
  { id: 3, studentName: 'Charlie Brown', plan: 'Annual', amount: 480, lastPayment: '2023-01-01' },
];

const initialTransactions = [
  { id: 1, date: '2023-06-01', description: 'Course payment', amount: 100 },
  { id: 2, date: '2023-05-28', description: 'Subscription renewal', amount: 50 },
  { id: 3, date: '2023-05-15', description: 'One-on-one session', amount: 75 },
  { id: 4, date: '2023-05-10', description: 'Course bundle sale', amount: 200 },
  { id: 5, date: '2023-05-05', description: 'Affiliate commission', amount: 25 },
  // Add more transactions here...
];

export default function FinancialDashboard() {
  const [earnings, setEarnings] = useState(initialEarnings);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [bankInfo, setBankInfo] = useState({ accountNumber: '', routingNumber: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [dateRange, setDateRange] = useState('6m');

  useEffect(() => {
    // In a real app, you would fetch financial data from your backend here
    // and update based on the selected date range
  }, [dateRange]);

  const filteredEarnings = earnings.slice(-getMonthsForRange(dateRange));

  const lineChartData = {
    labels: filteredEarnings.map(earning => earning.date),
    datasets: [
      {
        label: 'Earnings',
        data: filteredEarnings.map(earning => earning.amount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const barChartData = {
    labels: filteredEarnings.map(earning => {
      const date = new Date(earning.date);
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Monthly Earnings',
        data: filteredEarnings.map(earning => earning.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const totalEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);

  const handleWithdrawalMethodChange = (e) => {
    setWithdrawalMethod(e.target.value);
  };

  const handleBankInfoChange = (e) => {
    setBankInfo({ ...bankInfo, [e.target.name]: e.target.value });
  };

  const handlePaypalEmailChange = (e) => {
    setPaypalEmail(e.target.value);
  };

  const handleSavePreferences = () => {
    console.log('Saving withdrawal preferences:', { withdrawalMethod, bankInfo, paypalEmail });
    alert('Withdrawal preferences saved!');
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  function getMonthsForRange(range) {
    switch (range) {
      case '1m': return 1;
      case '3m': return 3;
      case '6m': return 6;
      case '1y': return 12;
      default: return 6;
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Financial Dashboard</h2>
      
      <div className="mb-4">
        <label className="mr-2">Date Range:</label>
        <select
          value={dateRange}
          onChange={handleDateRangeChange}
          className="p-2 border rounded"
        >
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Earnings Overview</h3>
          <p className="text-3xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
          <div className="h-64">
            <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Monthly Comparison</h3>
          <div className="h-64">
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className="border-b">
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">{transaction.description}</td>
                  <td className="p-2 text-right">${transaction.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2">Withdrawal Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Withdrawal Method</label>
            <select
              value={withdrawalMethod}
              onChange={handleWithdrawalMethodChange}
              className="w-full p-2 border rounded"
            >
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          
          {withdrawalMethod === 'bank' && (
            <div className="space-y-2">
              <div>
                <label className="block mb-1">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankInfo.accountNumber}
                  onChange={handleBankInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Routing Number</label>
                <input
                  type="text"
                  name="routingNumber"
                  value={bankInfo.routingNumber}
                  onChange={handleBankInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}
          
          {withdrawalMethod === 'paypal' && (
            <div>
              <label className="block mb-1">PayPal Email</label>
              <input
                type="email"
                value={paypalEmail}
                onChange={handlePaypalEmailChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          
          <button
            onClick={handleSavePreferences}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
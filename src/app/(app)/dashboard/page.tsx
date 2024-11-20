"use client";
import AnalyticsDashboard from '@/components/dashboard/AnalyticsContent';
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [analytics, setAnalytics] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [selectedOption, setSelectedOption] = useState("This Month");

  const options = ["This Year", "This Week", "This Month"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/trades/analytics", {
          filter: selectedOption,
        });
        setAnalytics(response.data.analytics);
      } catch (err) {
        setError("Failed to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOption]); // Re-fetch data when selectedOption changes

  return (
    <div className="min-h-screen  text-gray-200 p-6">
      <div className="mb-4">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded-md p-2"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <h1 className="text-3xl font-bold mb-6">Trading Analytics</h1>
      <AnalyticsDashboard
        analytics={analytics}
        loading={loading}
        error={error}
        selectedOption={selectedOption}
      />
    </div>
  );
};

export default App;

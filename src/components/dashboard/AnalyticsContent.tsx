"use client";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { ScrollArea } from "../ui/scroll-area";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AnalyticsDashboard = ({ analytics, loading, error, selectedOption }) => {
  const normalizedOption = selectedOption.toLowerCase().replace(" ", "");

  const pieData = {
    labels: Object.keys(analytics?.starRatings || {}),
    datasets: [
      {
        data: Object.values(analytics?.starRatings || {}),
        backgroundColor: ["#4caf50", "#ffeb3b", "#ff9800", "#f44336", "#9c27b0"],
        hoverBackgroundColor: ["#388e3c", "#fbc02d", "#f57c00", "#d32f2f", "#7b1fa2"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(analytics?.tradesByTime?.[normalizedOption] || {}),
    datasets: [
      {
        label: `Trades by ${selectedOption}`,
        data: Object.values(analytics?.tradesByTime?.[normalizedOption] || {}),
        backgroundColor: "#42a5f5",
      },
    ],
  };

  const pairsUsedBarData = {
    labels: analytics?.pairsUsed || [],
    datasets: [
      {
        label: "Pairs Used",
        data: analytics?.pairsUsedCounts || [],
        backgroundColor: "#ff5722",
      },
    ],
  };

  return (
    <div className="h-3/4 w-full p-4 space-y-6 bg-transparent overflow-hidden">
      <div className="bg-gray-100 p-6 rounded-md shadow-md">
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : analytics ? (
          <div className="h-full w-full p-4 space-y-6">
          <div className="bg-gray-100 p-6 rounded-md shadow-md">
            {loading ? (
              <p className="text-center text-blue-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : analytics ? (
              <ScrollArea className="h-3/4 w-full rounded-md border bg-gray-50 shadow-inner p-4">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>

  <div className="space-y-6">
    {/* Summary and Pie Chart Section */}
    <div className="flex flex-col md:flex-row md:space-x-6">
      {/* Summary Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
        <p className="text-gray-600 mb-2">
          <span className="font-medium text-gray-800">Total Trades:</span> {analytics.totalTrades}
        </p>
        <p className="text-gray-600">
          <span className="font-medium text-gray-800">Average Lot Size:</span> {analytics.avgLotSize}
        </p>
      </div>

      {/* Pie Chart Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Star Ratings</h3>
        <div className="h-64">
          <Pie data={pieData} />
        </div>
      </div>
    </div>

    {/* Bar Charts Section */}
    <div className="flex flex-col md:flex-row md:space-x-6">
      {/* Pairs Used Chart */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pairs Used</h3>
        <div className="h-64">
          <Bar data={pairsUsedBarData} />
        </div>
      </div>

      {/* Trades by Time Chart */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trades by {selectedOption}</h3>
        <div className="h-64">
          <Bar data={barData} />
        </div>
      </div>
    </div>
  </div>
</ScrollArea>

            ) : (
              <p className="text-center text-gray-500">No analytics data available.</p>
            )}
          </div>
        </div>
        
        ) : (
          <p className="text-center text-gray-500">No analytics data available.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Label,
  Cell,
} from "recharts";
import Navbar from "../components/NavigationBar";
import Loading from "../components/Loading";

const COLORS = [
  "#6366F1",
  "#A78BFA",
  "#60A5FA",
  "#EC4899",
  "#34D399",
  "#FACC15",
  "#F87171",
  "#82ca9d",
  "#FF8C00",
  "#FF6347",
];

const Dashboard = () => {
  const [growthData, setGrowthData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rmse, setRmse] = useState(null);
  const [r2, setR2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRange, setFilterRange] = useState(20);
  const [avgGrowthRate, setAvgGrowthRate] = useState(0);
  const [totalBusinesses, setTotalBusinesses] = useState(0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className=" p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold">{data.Business_Name}</p>
          <p>Growth Rate: {data["Growth_Rate (%)"].toFixed(2)}%</p>
          <p>Revenue Growth Rate: {data.Revenue_Growth_Rate.toFixed(2)}%</p>
          <p>Asset Growth Rate: {data.Asset_Growth_Rate.toFixed(2)}%</p>
          <p>Loan Dependency Ratio: {data.Loan_Dependency_Ratio.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Fetch Data
  useEffect(() => {
    const fetchProcessedData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-processed-data");
        const result = await response.json();

        if (!result.error) {
          setGrowthData(result.processed_data);
          setRmse(result.accuracy.RMSE);
          setR2(result.accuracy.R2);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Failed to fetch processed data:", error);
        setError("Failed to load data. Please try again later.");
      }
      setLoading(false);
    };

    fetchProcessedData();
  }, []);

  // Filter Data Based on Growth Rate
  useEffect(() => {
    const filtered = growthData.filter(
      (item) => item["Growth_Rate (%)"] > filterRange
    );
    setFilteredData(filtered);

    if (filtered.length > 0) {
      const avgRate =
        filtered.reduce((acc, item) => acc + item["Growth_Rate (%)"], 0) /
        filtered.length;
      setAvgGrowthRate(avgRate.toFixed(2));
      setTotalBusinesses(filtered.length);
    } else {
      setAvgGrowthRate(0);
      setTotalBusinesses(0);
    }
  }, [growthData, filterRange]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = Object.keys(filteredData[0]).join(",") + "\n";
    const csvRows = filteredData
      .map((row) =>
        Object.values(row)
          .map((value) => (typeof value === "string" ? `"${value}"` : value))
          .join(",")
      )
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + csvRows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8">
        {loading ? (
          <p className="text-center text-lg font-semibold"><Loading/></p>
        ) : error ? (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        ) : (
          <>
            {/* 🎛️ Filter and Export Section */}
            <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
    <label className="text-lg font-semibold">Filter Growth Rate:</label>
    <input
      type="range"
      min="5"
      max="50"
      value={filterRange}
      onChange={(e) => setFilterRange(Number(e.target.value))}
      className="w-full sm:w-40"
    />
    <span className="text-gray-700">{filterRange}%</span>
  </div>
  <button
    onClick={exportToCSV}
    className="bg-blue-600 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-700 w-full sm:w-auto"
  >
    Export to CSV
  </button>
</div>


            {/* 📊 Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <p className="text-gray-700 font-semibold">Total Businesses</p>
                <p className="text-2xl font-bold">{totalBusinesses}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <p className="text-gray-700 font-semibold">Avg. Growth Rate</p>
                <p className="text-2xl font-bold">{avgGrowthRate}%</p>
              </div>
              {/* <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <p className="text-gray-700 font-semibold">Data Accuracy (R²)</p>
                <p className="text-2xl font-bold">{r2?.toFixed(3)}</p>
              </div> */}
            </div>

            {/* 📊 Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 📈 Top Growth Rate */}
              <div className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
                <h2 className="text-lg font-semibold mb-4">
                  Top Businesses - Growth Rate
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredData.slice(0, 10)}>
                    <XAxis
                      dataKey="Business_Name"
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Growth_Rate (%)" fill="#6366F1">
                      {filteredData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 📈 Revenue Growth Rate */}
              <div className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
                <h2 className="text-lg font-semibold mb-4">
                  Revenue Growth Rate
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredData.slice(0, 10)}>
                    <XAxis
                      dataKey="Business_Name"
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Bar dataKey="Revenue_Growth_Rate" fill="#34D399" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 📈 Asset Growth Rate */}
              <div className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
                <h2 className="text-lg font-semibold mb-4">Asset Growth Rate</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredData.slice(0, 10)}>
                    <XAxis
                      dataKey="Business_Name"
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Asset_Growth_Rate" fill="#FACC15" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 📈 Loan Dependency Ratio */}
              <div className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
                <h2 className="text-lg font-semibold mb-4">
                  Loan Dependency Ratio
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredData.slice(0, 10)}>
                    <XAxis
                      dataKey="Business_Name"
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Loan_Dependency_Ratio" fill="#FF8C00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 📈 Growth Rate Trends */}
              <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2 transition-transform transform hover:scale-105">
                <h2 className="text-lg font-semibold mb-4">
                  Growth Rate Trends
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Business_Name" hide />
                    <YAxis>
                      <Label
                        angle={-90}
                        position="insideLeft"
                        style={{ textAnchor: "middle" }}
                      >
                        Growth Rate (%)
                      </Label>
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Growth_Rate (%)"
                      stroke="#34D399"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      animationBegin={300}
                      animationDuration={1500}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;

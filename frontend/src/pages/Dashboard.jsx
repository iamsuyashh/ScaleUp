import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Label, Cell
} from "recharts";
import Navbar from "../components/NavigationBar";

const COLORS = ["#6366F1", "#A78BFA", "#60A5FA", "#EC4899", "#34D399"];

const Dashboard = () => {
    const [growthData, setGrowthData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [rmse, setRmse] = useState(null);
    const [r2, setR2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterRange, setFilterRange] = useState(20); // Default: Show businesses with > 20% growth

    useEffect(() => {
        const fetchProcessedData = async () => {
            try {
                const response = await fetch("http://localhost:5000/get-processed-data");
                const result = await response.json();

                if (!result.error) {
                    setGrowthData(result.processed_data);
                    setRmse(result.accuracy.RMSE);
                    setR2(result.accuracy.R2);
                }
            } catch (error) {
                console.error("Failed to fetch processed data:", error);
            }
            setLoading(false);
        };

        fetchProcessedData();
    }, []);

    useEffect(() => {
        // Filter businesses by growth rate
        const filtered = growthData.filter(item => item["Growth_Rate (%)"] > filterRange);
        setFilteredData(filtered);
    }, [growthData, filterRange]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen p-8 bg-gray-100 flex flex-col gap-6">
                {loading ? (
                    <p>Loading data...</p>
                ) : (
                    <>
                        {/* 🎛 Filter Controls */}
                        <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
                            <label className="text-lg font-semibold">Filter Growth Rate:</label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={filterRange}
                                onChange={(e) => setFilterRange(e.target.value)}
                                className="w-40"
                            />
                            <span className="text-gray-700">{filterRange}%</span>
                        </div>

                        {/* 📊 Growth Bar Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-lg font-semibold">Top Businesses - Growth Rate</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredData.slice(0, 10)}> {/* Show only top 10 */}
                                    <XAxis dataKey="Business_Name" angle={-30} textAnchor="end" height={60} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Growth_Rate (%)" fill="#6366F1">
                                        {filteredData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 📈 Growth Trends Line Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-lg font-semibold">Growth Rate Trends</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={filteredData.slice(0, 20)}> {/* Show first 20 */}
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Business_Name" hide={true} />
                                    <YAxis>
                                        <Label angle={-90} position="insideLeft" style={{ textAnchor: "middle" }}>
                                            Growth Rate (%)
                                        </Label>
                                    </YAxis>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Growth_Rate (%)" stroke="#34D399" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 📏 Model Accuracy */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-lg font-semibold">Model Accuracy</h2>
                            <p className="text-gray-700">RMSE: {rmse ? rmse.toFixed(2) : "N/A"}</p>
                            <p className="text-gray-700">R² Score: {r2 ? r2.toFixed(2) : "N/A"}</p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Dashboard;

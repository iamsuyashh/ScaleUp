import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Navbar from "../components/NavigationBar";

const ageGenderData = [
  { ageGroup: "18-24", male: 2, female: 1.3, percentage: 3.3 },
  { ageGroup: "25-34", male: 7, female: 5.7, percentage: 12.7 },
  { ageGroup: "35-44", male: 8, female: 7.2, percentage: 15.2 },
  { ageGroup: "45-64", male: 14, female: 12.3, percentage: 26.3 },
  { ageGroup: "65+", male: 18, female: 15.5, percentage: 33.5 },
];

const demographicData = [
  { year: "2019", male: 3.5, female: 3.1 },
  { year: "2020", male: 3.9, female: 3.2 },
  { year: "2021", male: 3.2, female: 2.8 },
  { year: "2022", male: 1.5, female: 1.2 },
];

const browserData = [
  { name: "Chrome", value: 12798 },
  { name: "Firefox", value: 2811 },
  { name: "Safari", value: 5921 },
  { name: "Edge", value: 3820 },
];

const COLORS = ["#6366F1", "#A78BFA", "#60A5FA", "#EC4899"];

const paymentData = [
  { date: "1 Oct", wire: 2000, mobile: 1500 },
  { date: "3 Oct", wire: 2500, mobile: 1800 },
  { date: "7 Oct", wire: 3000, mobile: 2100 },
  { date: "10 Oct", wire: 2000, mobile: 1400 },
  { date: "14 Oct", wire: 3500, mobile: 2800 },
  { date: "18 Oct", wire: 2300, mobile: 1900 },
  { date: "23 Oct", wire: 2700, mobile: 2200 },
  { date: "27 Oct", wire: 3200, mobile: 2500 },
  { date: "30 Oct", wire: 3800, mobile: 2900 },
];

const Dashboard = () => {

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 bg-gray-100 flex flex-col gap-6">
        {/* Age & Gender */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">Statistics - Age and Gender</h2>
          <p className="text-sm text-gray-500">Total: 31,863</p>
          {ageGenderData.map((item, index) => (
            <div key={index} className="mt-2">
              <p className="text-sm">{item.ageGroup}</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 bg-blue-500" style={{ width: `${item.male * 5}%` }}></div>
                <div className="h-2 bg-purple-400" style={{ width: `${item.female * 5}%` }}></div>
                <span className="text-xs text-gray-600">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Demographics & Browser Usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demographics */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Statistics - Demographic</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={demographicData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" fill="#6366F1" />
                <Bar dataKey="female" fill="#A78BFA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Browser Usage */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Statistics - Browser Usage</h2>
            <p className="text-sm text-gray-500">This week: 229,293</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={browserData} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" dataKey="value">
                  {browserData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Received */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">Statistics - Payment Received</h2>
          <div className="flex space-x-4 mt-2 text-sm">
            <p className="text-blue-500">Wire Transfer</p>
            <p className="text-purple-500">Mobile Payment</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={paymentData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="wire" stroke="#6366F1" />
              <Line type="monotone" dataKey="mobile" stroke="#A78BFA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>

  );
};

export default Dashboard;

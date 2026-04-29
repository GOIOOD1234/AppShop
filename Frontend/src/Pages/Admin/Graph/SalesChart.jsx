import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { admin } from "../../../JS/Variables";

const SalesChart = () => {
  const [data, setData] = useState([]);
  const [time,setTimer] = useState(-10)

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(admin);

        if (response.data.success) {
          const adminData = response.data.data[0]?.money[0] || { date: [], sum: [] };
          
          const formattedData = adminData.date.map((date, index) => ({
            date, 
            sales: adminData.sum[index] || 0 
          }));

          const lastTenDays = formattedData.slice(time);
          setData(lastTenDays);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="chart-container">

      <h2 className="chart-title">Daily sales graph of dey {Math.abs(time)}</h2>
      <ResponsiveContainer width="130%" height={600}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 20, fill: '#333', angle: -45, textAnchor: 'end' }}
            height={100} 
          />
          <YAxis tick={{ fontSize: 18 }} />
          <Tooltip contentStyle={{ fontSize: '40px' }} />
          <Line
            type="monotone"
            name="sum of sales"
            dataKey="sales"
            stroke="#8884d8"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;

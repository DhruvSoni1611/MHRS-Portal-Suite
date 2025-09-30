import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Icon from "../../../components/AppIcon";

const DemographicsChart = ({ title, data, type = "bar" }) => {
  const colors = [
    "#1976D2",
    "#00ACC1",
    "#2E7D32",
    "#F57C00",
    "#D32F2F",
    "#9C27B0",
    "#FF5722",
  ];

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis dataKey="name" stroke="#757575" fontSize={12} tickLine={false} />
        <YAxis stroke="#757575" fontSize={12} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Bar dataKey="value" fill="#1976D2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100)?.toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors?.[index % colors?.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-muted transition-clinical">
            <Icon name="Download" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {type === "bar" ? renderBarChart() : renderPieChart()}
    </div>
  );
};

export default DemographicsChart;

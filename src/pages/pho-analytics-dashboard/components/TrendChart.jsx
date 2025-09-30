import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TrendChart = ({ title, data, lines, height = 300 }) => {
  const colors = ["#1976D2", "#00ACC1", "#2E7D32", "#F57C00", "#D32F2F"];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-xs bg-muted rounded-md text-muted-foreground hover:bg-accent/10 hover:text-accent transition-clinical">
            7D
          </button>
          <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md">
            30D
          </button>
          <button className="px-3 py-1 text-xs bg-muted rounded-md text-muted-foreground hover:bg-accent/10 hover:text-accent transition-clinical">
            90D
          </button>
        </div>
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis
              dataKey="date"
              stroke="#757575"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#757575" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            {lines?.map((line, index) => (
              <Line
                key={line?.key}
                type="monotone"
                dataKey={line?.key}
                stroke={colors?.[index % colors?.length]}
                strokeWidth={2}
                dot={{
                  fill: colors?.[index % colors?.length],
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: colors?.[index % colors?.length],
                  strokeWidth: 2,
                }}
                name={line?.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;

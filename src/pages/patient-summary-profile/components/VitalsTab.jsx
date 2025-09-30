import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Icon from "../../../components/AppIcon";

const VitalsTab = ({ vitalsData }) => {
  const [selectedVital, setSelectedVital] = useState("bloodPressure");

  const vitalTypes = [
    {
      id: "bloodPressure",
      name: "Blood Pressure",
      icon: "Heart",
      unit: "mmHg",
      color: "#D32F2F",
    },
    {
      id: "heartRate",
      name: "Heart Rate",
      icon: "Activity",
      unit: "bpm",
      color: "#1976D2",
    },
    {
      id: "temperature",
      name: "Temperature",
      icon: "Thermometer",
      unit: "°F",
      color: "#F57C00",
    },
    {
      id: "weight",
      name: "Weight",
      icon: "Scale",
      unit: "kg",
      color: "#2E7D32",
    },
    {
      id: "height",
      name: "Height",
      icon: "Ruler",
      unit: "cm",
      color: "#455A64",
    },
  ];

  const currentVital = vitalTypes?.find((v) => v?.id === selectedVital);

  return (
    <div className="space-y-6">
      {/* Vital Type Selector */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Select Vital Sign
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {vitalTypes?.map((vital) => (
            <button
              key={vital?.id}
              onClick={() => setSelectedVital(vital?.id)}
              className={`p-3 rounded-lg border transition-clinical ${
                selectedVital === vital?.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon name={vital?.icon} size={20} />
                <span className="text-xs font-medium">{vital?.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Vital Chart */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${currentVital?.color}20` }}
            >
              <Icon
                name={currentVital?.icon}
                size={16}
                style={{ color: currentVital?.color }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {currentVital?.name} Trend
              </h3>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md border border-border hover:bg-muted transition-clinical">
              <Icon name="Download" size={16} />
            </button>
            <button className="p-2 rounded-md border border-border hover:bg-muted transition-clinical">
              <Icon name="Share" size={16} />
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalsData?.[selectedVital]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="date" stroke="#757575" fontSize={12} />
              <YAxis stroke="#757575" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={currentVital?.color}
                strokeWidth={2}
                dot={{ fill: currentVital?.color, strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: currentVital?.color,
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Recent Measurements */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Measurements
          </h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-clinical">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date & Time
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Value
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Recorded By
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {vitalsData?.[selectedVital]
                ?.slice(0, 5)
                ?.map((measurement, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition-clinical"
                  >
                    <td className="py-3 px-4 text-sm text-foreground">
                      <div>
                        <p className="font-medium">{measurement?.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {measurement?.time}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {measurement?.value} {currentVital?.unit}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          measurement?.status === "normal"
                            ? "text-success bg-success/10"
                            : measurement?.status === "high"
                            ? "text-error bg-error/10"
                            : measurement?.status === "low"
                            ? "text-warning bg-warning/10"
                            : "text-muted-foreground bg-muted"
                        }`}
                      >
                        {measurement?.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {measurement?.recordedBy}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {measurement?.notes || "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VitalsTab;

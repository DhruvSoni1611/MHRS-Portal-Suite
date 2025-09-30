import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
} from "lucide-react";

const VitalSignsSection = ({ register, errors, watch }) => {
  const [vitalTrends, setVitalTrends] = useState({});
  const [validationWarnings, setValidationWarnings] = useState({});

  // Mock previous vitals for trend comparison
  const previousVitals = {
    temperature: "98.6",
    systolic: "120",
    diastolic: "80",
    pulse: "72",
    respiratoryRate: "16",
    oxygenSaturation: "98",
    height: "170",
    weight: "70",
  };

  const vitalRanges = {
    temperature: { min: 96.0, max: 100.4, unit: "°F" },
    systolic: { min: 90, max: 140, unit: "mmHg" },
    diastolic: { min: 60, max: 90, unit: "mmHg" },
    pulse: { min: 60, max: 100, unit: "bpm" },
    respiratoryRate: { min: 12, max: 20, unit: "/min" },
    oxygenSaturation: { min: 95, max: 100, unit: "%" },
    height: { min: 50, max: 250, unit: "cm" },
    weight: { min: 10, max: 300, unit: "kg" },
  };

  const currentVitals = watch("vitalSigns") || {};

  useEffect(() => {
    const newWarnings = {};
    const newTrends = {};

    Object.keys(vitalRanges)?.forEach((vital) => {
      const current = parseFloat(currentVitals?.[vital] || 0);
      const previous = parseFloat(previousVitals?.[vital] || 0);
      const range = vitalRanges?.[vital];

      if (current > 0) {
        // Check if out of range
        if (current < range?.min || current > range?.max) {
          newWarnings[
            vital
          ] = `Normal range: ${range?.min}-${range?.max} ${range?.unit}`;
        }

        // Calculate trend
        if (previous > 0) {
          const change = ((current - previous) / previous) * 100;
          if (Math.abs(change) > 5) {
            // 5% change threshold
            newTrends[vital] = {
              direction: change > 0 ? "up" : "down",
              change: Math.abs(change)?.toFixed(1),
            };
          }
        }
      }
    });

    setValidationWarnings(newWarnings);
    setVitalTrends(newTrends);
  }, [currentVitals]);

  const calculateBMI = () => {
    const weight = parseFloat(currentVitals?.weight || 0);
    const height = parseFloat(currentVitals?.height || 0) / 100; // Convert cm to m

    if (weight > 0 && height > 0) {
      const bmi = weight / (height * height);
      return bmi?.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
    return { category: "Obese", color: "text-red-600" };
  };

  const renderVitalField = (name, label, type = "number", step = "0.1") => {
    const fieldName = `vitalSigns.${name}`;
    const hasWarning = validationWarnings?.[name];
    const trend = vitalTrends?.[name];
    const range = vitalRanges?.[name];

    return (
      <div className="space-y-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          <span className="text-gray-400 ml-1">({range?.unit})</span>
        </label>
        <div className="relative">
          <input
            type={type}
            id={name}
            step={step}
            {...register(fieldName, {
              valueAsNumber: type === "number",
              validate: (value) => {
                if (!value) return true;
                const num = parseFloat(value);
                if (num < range?.min || num > range?.max) {
                  return `Normal range: ${range?.min}-${range?.max} ${range?.unit}`;
                }
                return true;
              },
            })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
              hasWarning ? "border-yellow-300 bg-yellow-50" : "border-gray-300"
            }`}
            placeholder={`${range?.min}-${range?.max}`}
          />
          {trend && (
            <div className="absolute right-2 top-2">
              {trend?.direction === "up" ? (
                <TrendingUp
                  className="h-4 w-4 text-red-500"
                  title={`+${trend?.change}% from last visit`}
                />
              ) : (
                <TrendingDown
                  className="h-4 w-4 text-blue-500"
                  title={`-${trend?.change}% from last visit`}
                />
              )}
            </div>
          )}
        </div>
        {hasWarning && (
          <div className="flex items-center text-xs text-yellow-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {hasWarning}
          </div>
        )}
        {errors?.vitalSigns?.[name] && (
          <p className="text-xs text-red-600">
            {errors?.vitalSigns?.[name]?.message}
          </p>
        )}
      </div>
    );
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Vital Signs
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Record patient vital signs with automatic validation and trend
          comparison
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderVitalField("temperature", "Temperature", "number", "0.1")}
        {renderVitalField("pulse", "Heart Rate", "number", "1")}
        {renderVitalField("respiratoryRate", "Respiratory Rate", "number", "1")}
        {renderVitalField(
          "oxygenSaturation",
          "Oxygen Saturation",
          "number",
          "1"
        )}
      </div>
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Blood Pressure</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderVitalField("systolic", "Systolic BP", "number", "1")}
          {renderVitalField("diastolic", "Diastolic BP", "number", "1")}
        </div>

        {currentVitals?.systolic && currentVitals?.diastolic && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Blood Pressure:</strong> {currentVitals?.systolic}/
              {currentVitals?.diastolic} mmHg
            </p>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">
          Anthropometric Measurements
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderVitalField("height", "Height", "number", "0.1")}
          {renderVitalField("weight", "Weight", "number", "0.1")}
        </div>

        {bmi && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Body Mass Index (BMI):{" "}
                  <span className="text-lg">{bmi} kg/m²</span>
                </p>
                <p className={`text-sm font-medium ${bmiInfo?.color}`}>
                  Category: {bmiInfo?.category}
                </p>
              </div>
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Pain Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="painScale"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pain Scale (0-10)
            </label>
            <select
              id="painScale"
              {...register("vitalSigns.painScale")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No pain assessment</option>
              {[...Array(11)]?.map((_, i) => (
                <option key={i} value={i}>
                  {i} -{" "}
                  {i === 0
                    ? "No pain"
                    : i <= 3
                    ? "Mild"
                    : i <= 6
                    ? "Moderate"
                    : "Severe"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="painLocation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pain Location
            </label>
            <input
              type="text"
              id="painLocation"
              {...register("vitalSigns.painLocation")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe pain location..."
            />
          </div>
        </div>
      </div>
      {Object.keys(vitalTrends)?.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Vital Signs Trends</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(vitalTrends)?.map(([vital, trend]) => (
              <div key={vital} className="p-2 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600 capitalize">
                  {vital?.replace(/([A-Z])/g, " $1")}
                </p>
                <div className="flex items-center justify-center mt-1">
                  {trend?.direction === "up" ? (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-blue-500 mr-1" />
                  )}
                  <span className="text-xs font-medium">{trend?.change}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSignsSection;

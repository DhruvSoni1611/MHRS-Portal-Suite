import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

const ChiefComplaintSection = ({ register, errors, watch }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const commonComplaints = [
    "Chest pain",
    "Shortness of breath",
    "Abdominal pain",
    "Headache",
    "Fever",
    "Cough",
    "Nausea and vomiting",
    "Back pain",
    "Fatigue",
    "Dizziness",
  ];

  const handleTemplateSelect = (template) => {
    const currentValue = watch("chiefComplaint") || "";
    const newValue = currentValue ? `${currentValue}, ${template}` : template;
    document.getElementById("chiefComplaint").value = newValue;
    setShowTemplates(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Chief Complaint</h3>
        <p className="text-sm text-gray-500 mt-1">
          Document the patient's primary reason for the visit in their own words
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="chiefComplaint"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Patient's Chief Complaint *
          </label>
          <textarea
            id="chiefComplaint"
            {...register("chiefComplaint", {
              required: "Chief complaint is required",
              minLength: {
                value: 10,
                message: "Please provide more detail (minimum 10 characters)",
              },
            })}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.chiefComplaint ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Describe the patient's primary concern in their own words..."
          />
          {errors?.chiefComplaint && (
            <p className="mt-1 text-sm text-red-600">
              {errors?.chiefComplaint?.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Quick Templates
            </label>
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              {showTemplates ? "Hide" : "Show"} Templates
            </button>
          </div>

          {showTemplates && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 p-4 bg-gray-50 rounded-md">
              {commonComplaints?.map((complaint, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTemplateSelect(complaint)}
                  className="text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {complaint}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Duration of Symptoms
            </label>
            <input
              type="text"
              id="duration"
              {...register("symptomDuration")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 3 days, 2 weeks"
            />
          </div>

          <div>
            <label
              htmlFor="severity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Severity (1-10)
            </label>
            <select
              id="severity"
              {...register("severity")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select severity</option>
              {[...Array(10)]?.map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} -{" "}
                  {i === 0
                    ? "Minimal"
                    : i < 3
                    ? "Mild"
                    : i < 6
                    ? "Moderate"
                    : i < 8
                    ? "Severe"
                    : "Extreme"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiefComplaintSection;

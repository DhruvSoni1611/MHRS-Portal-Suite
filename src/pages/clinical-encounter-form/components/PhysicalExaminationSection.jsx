import React, { useState } from "react";
import { Eye, Heart, Stethoscope } from "lucide-react";
import Icon from "../../../components/AppIcon";

const PhysicalExaminationSection = ({ register, errors, setValue, watch }) => {
  const [examFindings, setExamFindings] = useState({});

  const bodySystemsExam = [
    {
      system: "General Appearance",
      icon: Eye,
      findings: [
        "Well-appearing",
        "Ill-appearing",
        "Distressed",
        "Alert",
        "Oriented x3",
      ],
    },
    {
      system: "Head & Neck",
      icon: Eye,
      findings: [
        "Normocephalic",
        "Atraumatic",
        "No lymphadenopathy",
        "Thyroid normal",
        "No JVD",
      ],
    },
    {
      system: "Cardiovascular",
      icon: Heart,
      findings: [
        "Regular rate and rhythm",
        "No murmurs",
        "No gallops",
        "No rubs",
        "PMI normal",
      ],
    },
    {
      system: "Respiratory",
      icon: Stethoscope,
      findings: [
        "Clear to auscultation bilaterally",
        "No wheezes",
        "No rales",
        "No rhonchi",
        "Equal breath sounds",
      ],
    },
    {
      system: "Abdomen",
      icon: Eye,
      findings: [
        "Soft",
        "Non-tender",
        "Non-distended",
        "Bowel sounds present",
        "No masses",
      ],
    },
    {
      system: "Extremities",
      icon: Eye,
      findings: [
        "No edema",
        "Pulses intact",
        "No cyanosis",
        "Full range of motion",
        "No deformities",
      ],
    },
    {
      system: "Neurological",
      icon: Eye,
      findings: [
        "Alert and oriented",
        "Cranial nerves intact",
        "Motor strength 5/5",
        "Reflexes normal",
        "No focal deficits",
      ],
    },
    {
      system: "Skin",
      icon: Eye,
      findings: [
        "Warm and dry",
        "No rashes",
        "No lesions",
        "Good turgor",
        "No cyanosis",
      ],
    },
  ];

  const handleFindingToggle = (system, finding) => {
    const key = `${system}_${finding}`;
    setExamFindings((prev) => ({
      ...prev,
      [key]: !prev?.[key],
    }));
  };

  const getSelectedFindings = (system) => {
    return (
      bodySystemsExam
        ?.find((s) => s?.system === system)
        ?.findings?.filter(
          (finding) => examFindings?.[`${system}_${finding}`]
        ) || []
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Physical Examination
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Document physical examination findings by body system
        </p>
      </div>
      <div className="space-y-6">
        {bodySystemsExam?.map((system, idx) => {
          const Icon = system?.icon;
          const selectedFindings = getSelectedFindings(system?.system);

          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Icon className="h-5 w-5 text-gray-500 mr-2" />
                <h4 className="font-medium text-gray-900">{system?.system}</h4>
                {selectedFindings?.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {selectedFindings?.length} selected
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {system?.findings?.map((finding, findingIdx) => (
                  <label
                    key={findingIdx}
                    className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        examFindings?.[`${system?.system}_${finding}`] || false
                      }
                      onChange={() =>
                        handleFindingToggle(system?.system, finding)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">{finding}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional {system?.system} Notes
                </label>
                <textarea
                  {...register(
                    `physicalExam.${system?.system
                      ?.replace(/\s+/g, "")
                      ?.toLowerCase()}Notes`
                  )}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder={`Additional findings for ${system?.system?.toLowerCase()}...`}
                />
              </div>
              {selectedFindings?.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Selected Findings:
                  </p>
                  <p className="text-sm text-blue-800">
                    {selectedFindings?.join(", ")}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">
            Overall Physical Examination Summary
          </h4>
          <textarea
            {...register("physicalExamSummary")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Summarize overall physical examination findings and any significant abnormalities..."
          />
        </div>
      </div>
    </div>
  );
};

export default PhysicalExaminationSection;

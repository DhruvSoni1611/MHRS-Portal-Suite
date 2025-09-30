import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const PresentIllnessSection = ({ register, errors, watch }) => {
  const [reviewOfSystems, setReviewOfSystems] = useState({});

  const systemsReview = [
    {
      system: "Cardiovascular",
      symptoms: ["Chest pain", "Palpitations", "Shortness of breath", "Edema"],
    },
    {
      system: "Respiratory",
      symptoms: ["Cough", "Dyspnea", "Wheezing", "Sputum production"],
    },
    {
      system: "Gastrointestinal",
      symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain"],
    },
    {
      system: "Neurological",
      symptoms: ["Headache", "Dizziness", "Weakness", "Numbness"],
    },
    {
      system: "Musculoskeletal",
      symptoms: ["Joint pain", "Muscle aches", "Stiffness", "Swelling"],
    },
  ];

  const handleSystemReview = (system, symptom, value) => {
    setReviewOfSystems((prev) => ({
      ...prev,
      [`${system}_${symptom}`]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">
          History of Present Illness
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Document the detailed story of the patient's current illness
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="presentIllness"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            History of Present Illness *
          </label>
          <textarea
            id="presentIllness"
            {...register("presentIllness", {
              required: "History of present illness is required",
              minLength: {
                value: 20,
                message: "Please provide more detail (minimum 20 characters)",
              },
            })}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.presentIllness ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Use OPQRST format: Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, Timing..."
          />
          {errors?.presentIllness && (
            <p className="mt-1 text-sm text-red-600">
              {errors?.presentIllness?.message}
            </p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <strong>OPQRST Guide:</strong> Onset (when did it start?),
            Provocation/Palliation (what makes it better/worse?), Quality (what
            does it feel like?), Region/Radiation (where is it/does it spread?),
            Severity (how bad is it?), Timing (constant/intermittent?)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="associatedSymptoms"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Associated Symptoms
            </label>
            <textarea
              id="associatedSymptoms"
              {...register("associatedSymptoms")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Other symptoms that occur with the chief complaint..."
            />
          </div>

          <div>
            <label
              htmlFor="aggravatingFactors"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Aggravating/Alleviating Factors
            </label>
            <textarea
              id="aggravatingFactors"
              {...register("aggravatingFactors")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What makes symptoms better or worse..."
            />
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Review of Systems
          </h4>
          <div className="space-y-4">
            {systemsReview?.map((system, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-3">
                  {system?.system}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {system?.symptoms?.map((symptom, symptomIdx) => (
                    <div
                      key={symptomIdx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{symptom}</span>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleSystemReview(
                              system?.system,
                              symptom,
                              "positive"
                            )
                          }
                          className={`p-1 rounded ${
                            reviewOfSystems?.[
                              `${system?.system}_${symptom}`
                            ] === "positive"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                          }`}
                          title="Positive"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSystemReview(
                              system?.system,
                              symptom,
                              "negative"
                            )
                          }
                          className={`p-1 rounded ${
                            reviewOfSystems?.[
                              `${system?.system}_${symptom}`
                            ] === "negative"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500"
                          }`}
                          title="Negative"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentIllnessSection;

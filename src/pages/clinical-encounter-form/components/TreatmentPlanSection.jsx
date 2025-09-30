import React, { useState } from "react";
import { Plus, X, Pill, Calendar, FileText } from "lucide-react";

const TreatmentPlanSection = ({ register, errors, setValue, watch }) => {
  const [medications, setMedications] = useState([]);
  const [procedures, setProcedures] = useState([]);

  const addMedication = () => {
    const newMed = {
      id: Date.now(),
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    };
    setMedications([...medications, newMed]);
  };

  const removeMedication = (id) => {
    setMedications(medications?.filter((med) => med?.id !== id));
  };

  const updateMedication = (id, field, value) => {
    setMedications(
      medications?.map((med) =>
        med?.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const addProcedure = () => {
    const newProc = {
      id: Date.now(),
      name: "",
      indication: "",
      plannedDate: "",
      notes: "",
    };
    setProcedures([...procedures, newProc]);
  };

  const removeProcedure = (id) => {
    setProcedures(procedures?.filter((proc) => proc?.id !== id));
  };

  const updateProcedure = (id, field, value) => {
    setProcedures(
      procedures?.map((proc) =>
        proc?.id === id ? { ...proc, [field]: value } : proc
      )
    );
  };

  const commonMedications = [
    "Acetaminophen 500mg",
    "Ibuprofen 400mg",
    "Amoxicillin 500mg",
    "Lisinopril 10mg",
    "Metformin 500mg",
    "Atorvastatin 20mg",
    "Omeprazole 20mg",
    "Amlodipine 5mg",
  ];

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Treatment Plan</h3>
        <p className="text-sm text-gray-500 mt-1">
          Document medications, procedures, and follow-up care for the patient
        </p>
      </div>
      {/* Medications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Pill className="h-5 w-5 mr-2" />
            Medications
          </h4>
          <button
            type="button"
            onClick={addMedication}
            className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Medication
          </button>
        </div>

        {medications?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No medications prescribed yet</p>
            <p className="text-sm">Click "Add Medication" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications?.map((med) => (
              <div
                key={med?.id}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                <button
                  type="button"
                  onClick={() => removeMedication(med?.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medication Name *
                    </label>
                    <input
                      type="text"
                      value={med?.name}
                      onChange={(e) =>
                        updateMedication(med?.id, "name", e?.target?.value)
                      }
                      list={`medications-${med?.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Start typing medication name..."
                      required
                    />
                    <datalist id={`medications-${med?.id}`}>
                      {commonMedications?.map((medication, idx) => (
                        <option key={idx} value={medication} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={med?.dosage}
                      onChange={(e) =>
                        updateMedication(med?.id, "dosage", e?.target?.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 500mg, 1 tablet"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={med?.frequency}
                      onChange={(e) =>
                        updateMedication(med?.id, "frequency", e?.target?.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select frequency</option>
                      {frequencyOptions?.map((freq, idx) => (
                        <option key={idx} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={med?.duration}
                      onChange={(e) =>
                        updateMedication(med?.id, "duration", e?.target?.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 7 days, 2 weeks"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={med?.instructions}
                    onChange={(e) =>
                      updateMedication(
                        med?.id,
                        "instructions",
                        e?.target?.value
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Take with food, Avoid alcohol..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Procedures Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Procedures & Tests
          </h4>
          <button
            type="button"
            onClick={addProcedure}
            className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 border border-green-200 rounded-md hover:bg-green-200 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Procedure
          </button>
        </div>

        {procedures?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No procedures ordered yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {procedures?.map((proc) => (
              <div
                key={proc?.id}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                <button
                  type="button"
                  onClick={() => removeProcedure(proc?.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure/Test Name *
                    </label>
                    <input
                      type="text"
                      value={proc?.name}
                      onChange={(e) =>
                        updateProcedure(proc?.id, "name", e?.target?.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Chest X-ray, Blood work..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Planned Date
                    </label>
                    <input
                      type="date"
                      value={proc?.plannedDate}
                      onChange={(e) =>
                        updateProcedure(
                          proc?.id,
                          "plannedDate",
                          e?.target?.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indication
                  </label>
                  <textarea
                    value={proc?.indication}
                    onChange={(e) =>
                      updateProcedure(proc?.id, "indication", e?.target?.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Reason for procedure/test..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={proc?.notes}
                    onChange={(e) =>
                      updateProcedure(proc?.id, "notes", e?.target?.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Special instructions or notes..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Follow-up Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Follow-up Care
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="followUpType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Follow-up Type
            </label>
            <select
              id="followUpType"
              {...register("treatmentPlan.followUpType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No follow-up needed</option>
              <option value="clinic">Return to clinic</option>
              <option value="phone">Phone follow-up</option>
              <option value="telehealth">Telehealth appointment</option>
              <option value="specialist">Specialist referral</option>
              <option value="prn">As needed (PRN)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="followUpTimeframe"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Timeframe
            </label>
            <select
              id="followUpTimeframe"
              {...register("treatmentPlan.followUpTimeframe")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select timeframe</option>
              <option value="1-week">1 week</option>
              <option value="2-weeks">2 weeks</option>
              <option value="1-month">1 month</option>
              <option value="3-months">3 months</option>
              <option value="6-months">6 months</option>
              <option value="1-year">1 year</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="followUpInstructions"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Follow-up Instructions
          </label>
          <textarea
            id="followUpInstructions"
            {...register("treatmentPlan.followUpInstructions")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Specific instructions for follow-up care, monitoring parameters, when to return..."
          />
        </div>

        <div>
          <label
            htmlFor="patientEducation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Patient Education & Discharge Instructions
          </label>
          <textarea
            id="patientEducation"
            {...register("treatmentPlan.patientEducation")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Patient education provided, warning signs to watch for, lifestyle modifications, etc..."
          />
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanSection;

import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const MedicalHistoryStep = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrevious,
  onSave,
}) => {
  const [showAllergies, setShowAllergies] = useState(
    formData?.medicalHistory?.hasAllergies || false
  );
  const [showMedications, setShowMedications] = useState(
    formData?.medicalHistory?.hasCurrentMedications || false
  );

  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "unknown", label: "Unknown" },
  ];

  const commonConditions = [
    { id: "diabetes", label: "Diabetes" },
    { id: "hypertension", label: "Hypertension (High Blood Pressure)" },
    { id: "heart-disease", label: "Heart Disease" },
    { id: "asthma", label: "Asthma" },
    { id: "arthritis", label: "Arthritis" },
    { id: "thyroid", label: "Thyroid Disorders" },
    { id: "kidney-disease", label: "Kidney Disease" },
    { id: "liver-disease", label: "Liver Disease" },
    { id: "cancer", label: "Cancer (Any Type)" },
    { id: "mental-health", label: "Mental Health Conditions" },
  ];

  const commonAllergies = [
    { id: "penicillin", label: "Penicillin" },
    { id: "aspirin", label: "Aspirin" },
    { id: "sulfa", label: "Sulfa Drugs" },
    { id: "latex", label: "Latex" },
    { id: "peanuts", label: "Peanuts" },
    { id: "shellfish", label: "Shellfish" },
    { id: "dairy", label: "Dairy Products" },
    { id: "eggs", label: "Eggs" },
    { id: "pollen", label: "Pollen" },
    { id: "dust", label: "Dust Mites" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev?.medicalHistory,
        [field]: value,
      },
    }));
  };

  const handleConditionChange = (conditionId, checked) => {
    const currentConditions = formData?.medicalHistory?.conditions || [];
    const updatedConditions = checked
      ? [...currentConditions, conditionId]
      : currentConditions?.filter((id) => id !== conditionId);

    handleInputChange("conditions", updatedConditions);
  };

  const handleAllergyChange = (allergyId, checked) => {
    const currentAllergies = formData?.medicalHistory?.allergies || [];
    const updatedAllergies = checked
      ? [...currentAllergies, allergyId]
      : currentAllergies?.filter((id) => id !== allergyId);

    handleInputChange("allergies", updatedAllergies);
  };

  const addMedication = () => {
    const currentMedications =
      formData?.medicalHistory?.currentMedications || [];
    const newMedication = {
      id: Date.now(),
      name: "",
      dosage: "",
      frequency: "",
      prescribedBy: "",
    };
    handleInputChange("currentMedications", [
      ...currentMedications,
      newMedication,
    ]);
  };

  const updateMedication = (id, field, value) => {
    const currentMedications =
      formData?.medicalHistory?.currentMedications || [];
    const updatedMedications = currentMedications?.map((med) =>
      med?.id === id ? { ...med, [field]: value } : med
    );
    handleInputChange("currentMedications", updatedMedications);
  };

  const removeMedication = (id) => {
    const currentMedications =
      formData?.medicalHistory?.currentMedications || [];
    const updatedMedications = currentMedications?.filter(
      (med) => med?.id !== id
    );
    handleInputChange("currentMedications", updatedMedications);
  };

  const validateStep = () => {
    // Medical history is optional, so always return true
    return true;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Medical History
        </h3>
        <p className="text-muted-foreground">
          Provide the patient's medical history to help healthcare providers
          deliver better care. All information is optional but recommended for
          comprehensive care.
        </p>
      </div>
      <div className="space-y-8">
        {/* Basic Medical Information */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-4">
            Basic Medical Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Blood Group"
              options={bloodGroupOptions}
              value={formData?.medicalHistory?.bloodGroup}
              onChange={(value) => handleInputChange("bloodGroup", value)}
              placeholder="Select blood group"
            />

            <Input
              label="Height (cm)"
              type="number"
              placeholder="170"
              value={formData?.medicalHistory?.height}
              onChange={(e) => handleInputChange("height", e?.target?.value)}
              description="Patient's height in centimeters"
            />

            <Input
              label="Weight (kg)"
              type="number"
              placeholder="70"
              value={formData?.medicalHistory?.weight}
              onChange={(e) => handleInputChange("weight", e?.target?.value)}
              description="Patient's current weight in kilograms"
            />

            <Input
              label="BMI"
              type="number"
              placeholder="24.2"
              value={formData?.medicalHistory?.bmi}
              onChange={(e) => handleInputChange("bmi", e?.target?.value)}
              description="Body Mass Index (calculated automatically)"
              disabled
            />
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-4">
            Medical Conditions
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Select any medical conditions the patient currently has or has had
            in the past.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonConditions?.map((condition) => (
              <Checkbox
                key={condition?.id}
                label={condition?.label}
                checked={(formData?.medicalHistory?.conditions || [])?.includes(
                  condition?.id
                )}
                onChange={(e) =>
                  handleConditionChange(condition?.id, e?.target?.checked)
                }
              />
            ))}
          </div>

          <div className="mt-4">
            <Input
              label="Other Medical Conditions"
              type="text"
              placeholder="List any other medical conditions not mentioned above"
              value={formData?.medicalHistory?.otherConditions}
              onChange={(e) =>
                handleInputChange("otherConditions", e?.target?.value)
              }
              description="Separate multiple conditions with commas"
            />
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Checkbox
              label="Patient has known allergies"
              checked={showAllergies}
              onChange={(e) => {
                setShowAllergies(e?.target?.checked);
                handleInputChange("hasAllergies", e?.target?.checked);
                if (!e?.target?.checked) {
                  handleInputChange("allergies", []);
                  handleInputChange("allergyDetails", "");
                }
              }}
            />
          </div>

          {showAllergies && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {commonAllergies?.map((allergy) => (
                  <Checkbox
                    key={allergy?.id}
                    label={allergy?.label}
                    checked={(
                      formData?.medicalHistory?.allergies || []
                    )?.includes(allergy?.id)}
                    onChange={(e) =>
                      handleAllergyChange(allergy?.id, e?.target?.checked)
                    }
                  />
                ))}
              </div>

              <Input
                label="Allergy Details & Reactions"
                type="text"
                placeholder="Describe allergic reactions and severity"
                value={formData?.medicalHistory?.allergyDetails}
                onChange={(e) =>
                  handleInputChange("allergyDetails", e?.target?.value)
                }
                description="Include reaction symptoms and severity level"
              />
            </div>
          )}
        </div>

        {/* Current Medications */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Checkbox
              label="Patient is currently taking medications"
              checked={showMedications}
              onChange={(e) => {
                setShowMedications(e?.target?.checked);
                handleInputChange("hasCurrentMedications", e?.target?.checked);
                if (!e?.target?.checked) {
                  handleInputChange("currentMedications", []);
                }
              }}
            />
          </div>

          {showMedications && (
            <div className="space-y-4">
              {(formData?.medicalHistory?.currentMedications || [])?.map(
                (medication) => (
                  <div
                    key={medication?.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-foreground">
                        Medication Details
                      </h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(medication?.id)}
                        iconName="Trash2"
                        iconPosition="left"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Medication Name"
                        type="text"
                        placeholder="e.g., Metformin"
                        value={medication?.name}
                        onChange={(e) =>
                          updateMedication(
                            medication?.id,
                            "name",
                            e?.target?.value
                          )
                        }
                      />

                      <Input
                        label="Dosage"
                        type="text"
                        placeholder="e.g., 500mg"
                        value={medication?.dosage}
                        onChange={(e) =>
                          updateMedication(
                            medication?.id,
                            "dosage",
                            e?.target?.value
                          )
                        }
                      />

                      <Input
                        label="Frequency"
                        type="text"
                        placeholder="e.g., Twice daily"
                        value={medication?.frequency}
                        onChange={(e) =>
                          updateMedication(
                            medication?.id,
                            "frequency",
                            e?.target?.value
                          )
                        }
                      />

                      <Input
                        label="Prescribed By"
                        type="text"
                        placeholder="Doctor's name"
                        value={medication?.prescribedBy}
                        onChange={(e) =>
                          updateMedication(
                            medication?.id,
                            "prescribedBy",
                            e?.target?.value
                          )
                        }
                      />
                    </div>
                  </div>
                )
              )}

              <Button
                variant="outline"
                onClick={addMedication}
                iconName="Plus"
                iconPosition="left"
              >
                Add Another Medication
              </Button>
            </div>
          )}
        </div>

        {/* Family History */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-4">
            Family Medical History
          </h4>

          <Input
            label="Family Medical History"
            type="text"
            placeholder="List any significant medical conditions in family members"
            value={formData?.medicalHistory?.familyHistory}
            onChange={(e) =>
              handleInputChange("familyHistory", e?.target?.value)
            }
            description="Include conditions like diabetes, heart disease, cancer, etc. in immediate family"
          />
        </div>

        {/* Additional Notes */}
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-4">
            Additional Medical Notes
          </h4>

          <Input
            label="Additional Information"
            type="text"
            placeholder="Any other relevant medical information"
            value={formData?.medicalHistory?.additionalNotes}
            onChange={(e) =>
              handleInputChange("additionalNotes", e?.target?.value)
            }
            description="Include any other medical information that might be relevant for care"
          />
        </div>

        {/* Privacy Notice */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-accent mb-2">
                Medical Information Privacy
              </h4>
              <p className="text-sm text-muted-foreground">
                All medical information provided is confidential and will only
                be shared with authorized healthcare providers involved in the
                patient's care. This information helps ensure safe and effective
                treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Emergency Contact
          </Button>

          <Button
            variant="outline"
            onClick={onSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Draft
          </Button>
        </div>

        <Button onClick={onNext} iconName="ArrowRight" iconPosition="right">
          Continue to Consent Collection
        </Button>
      </div>
    </div>
  );
};

export default MedicalHistoryStep;

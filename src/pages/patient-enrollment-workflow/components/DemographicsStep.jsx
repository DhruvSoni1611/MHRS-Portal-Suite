import React from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const DemographicsStep = ({
  formData,
  setFormData,
  errors,
  onNext,
  onSave,
}) => {
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const stateOptions = [
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "gujarat", label: "Gujarat" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "west-bengal", label: "West Bengal" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      demographics: {
        ...prev?.demographics,
        [field]: value,
      },
    }));
  };

  const validateStep = () => {
    const required = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "phoneNumber",
    ];
    return required?.every((field) => formData?.demographics?.[field]);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Basic Demographics
        </h3>
        <p className="text-muted-foreground">
          Please provide the patient's basic demographic information. All fields
          marked with * are required.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter first name"
          value={formData?.demographics?.firstName}
          onChange={(e) => handleInputChange("firstName", e?.target?.value)}
          error={errors?.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter last name"
          value={formData?.demographics?.lastName}
          onChange={(e) => handleInputChange("lastName", e?.target?.value)}
          error={errors?.lastName}
          required
        />

        <Input
          label="Date of Birth"
          type="date"
          value={formData?.demographics?.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e?.target?.value)}
          error={errors?.dateOfBirth}
          required
        />

        <Select
          label="Gender"
          options={genderOptions}
          value={formData?.demographics?.gender}
          onChange={(value) => handleInputChange("gender", value)}
          error={errors?.gender}
          placeholder="Select gender"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData?.demographics?.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e?.target?.value)}
          error={errors?.phoneNumber}
          description="10-digit mobile number for SMS notifications"
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="patient@example.com"
          value={formData?.demographics?.email}
          onChange={(e) => handleInputChange("email", e?.target?.value)}
          error={errors?.email}
          description="Optional - for digital health records access"
        />

        <div className="md:col-span-2">
          <Input
            label="Address Line 1"
            type="text"
            placeholder="House/Flat number, Street name"
            value={formData?.demographics?.addressLine1}
            onChange={(e) =>
              handleInputChange("addressLine1", e?.target?.value)
            }
            error={errors?.addressLine1}
            required
          />
        </div>

        <Input
          label="Address Line 2"
          type="text"
          placeholder="Area, Locality (Optional)"
          value={formData?.demographics?.addressLine2}
          onChange={(e) => handleInputChange("addressLine2", e?.target?.value)}
        />

        <Input
          label="City"
          type="text"
          placeholder="Enter city"
          value={formData?.demographics?.city}
          onChange={(e) => handleInputChange("city", e?.target?.value)}
          error={errors?.city}
          required
        />

        <Select
          label="State"
          options={stateOptions}
          value={formData?.demographics?.state}
          onChange={(value) => handleInputChange("state", value)}
          error={errors?.state}
          placeholder="Select state"
          searchable
          required
        />

        <Input
          label="PIN Code"
          type="text"
          placeholder="123456"
          value={formData?.demographics?.pinCode}
          onChange={(e) => handleInputChange("pinCode", e?.target?.value)}
          error={errors?.pinCode}
          pattern="[0-9]{6}"
          maxLength={6}
          required
        />
      </div>
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onSave}
          iconName="Save"
          iconPosition="left"
        >
          Save Draft
        </Button>

        <Button
          onClick={onNext}
          disabled={!validateStep()}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to ABHA Integration
        </Button>
      </div>
    </div>
  );
};

export default DemographicsStep;

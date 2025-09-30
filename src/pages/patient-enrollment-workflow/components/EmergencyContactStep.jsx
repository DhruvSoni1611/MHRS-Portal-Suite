import React from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const EmergencyContactStep = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrevious,
  onSave,
}) => {
  const relationshipOptions = [
    { value: "spouse", label: "Spouse" },
    { value: "parent", label: "Parent" },
    { value: "child", label: "Child" },
    { value: "sibling", label: "Sibling" },
    { value: "relative", label: "Other Relative" },
    { value: "friend", label: "Friend" },
    { value: "guardian", label: "Legal Guardian" },
    { value: "caregiver", label: "Caregiver" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev?.emergencyContact,
        [field]: value,
      },
    }));
  };

  const addSecondaryContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev?.emergencyContact,
        hasSecondary: true,
      },
    }));
  };

  const removeSecondaryContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev?.emergencyContact,
        hasSecondary: false,
        secondaryName: "",
        secondaryPhone: "",
        secondaryRelationship: "",
        secondaryEmail: "",
      },
    }));
  };

  const validateStep = () => {
    const required = ["primaryName", "primaryPhone", "primaryRelationship"];
    return required?.every((field) => formData?.emergencyContact?.[field]);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Emergency Contact Information
        </h3>
        <p className="text-muted-foreground">
          Provide emergency contact details for the patient. This information
          will be used in case of medical emergencies or when the patient cannot
          be reached directly.
        </p>
      </div>
      {/* Primary Emergency Contact */}
      <div className="space-y-6">
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="UserCheck" size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">
              Primary Emergency Contact
            </h4>
            <span className="text-xs bg-error text-error-foreground px-2 py-1 rounded">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter contact's full name"
              value={formData?.emergencyContact?.primaryName}
              onChange={(e) =>
                handleInputChange("primaryName", e?.target?.value)
              }
              error={errors?.primaryName}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData?.emergencyContact?.primaryPhone}
              onChange={(e) =>
                handleInputChange("primaryPhone", e?.target?.value)
              }
              error={errors?.primaryPhone}
              description="Primary contact number for emergencies"
              required
            />

            <Select
              label="Relationship to Patient"
              options={relationshipOptions}
              value={formData?.emergencyContact?.primaryRelationship}
              onChange={(value) =>
                handleInputChange("primaryRelationship", value)
              }
              error={errors?.primaryRelationship}
              placeholder="Select relationship"
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="contact@example.com"
              value={formData?.emergencyContact?.primaryEmail}
              onChange={(e) =>
                handleInputChange("primaryEmail", e?.target?.value)
              }
              error={errors?.primaryEmail}
              description="Optional - for emergency notifications"
            />
          </div>

          <div className="mt-4">
            <Input
              label="Address"
              type="text"
              placeholder="Contact's address (Optional)"
              value={formData?.emergencyContact?.primaryAddress}
              onChange={(e) =>
                handleInputChange("primaryAddress", e?.target?.value)
              }
              description="Helpful if contact needs to be reached in person"
            />
          </div>
        </div>

        {/* Secondary Emergency Contact */}
        {!formData?.emergencyContact?.hasSecondary ? (
          <div className="text-center py-6">
            <Button
              variant="outline"
              onClick={addSecondaryContact}
              iconName="Plus"
              iconPosition="left"
            >
              Add Secondary Emergency Contact
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Optional - Provides backup contact in case primary contact is
              unavailable
            </p>
          </div>
        ) : (
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={20} className="text-secondary" />
                <h4 className="font-medium text-foreground">
                  Secondary Emergency Contact
                </h4>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  Optional
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeSecondaryContact}
                iconName="X"
                iconPosition="left"
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter contact's full name"
                value={formData?.emergencyContact?.secondaryName}
                onChange={(e) =>
                  handleInputChange("secondaryName", e?.target?.value)
                }
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData?.emergencyContact?.secondaryPhone}
                onChange={(e) =>
                  handleInputChange("secondaryPhone", e?.target?.value)
                }
                description="Secondary contact number"
              />

              <Select
                label="Relationship to Patient"
                options={relationshipOptions}
                value={formData?.emergencyContact?.secondaryRelationship}
                onChange={(value) =>
                  handleInputChange("secondaryRelationship", value)
                }
                placeholder="Select relationship"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="contact@example.com"
                value={formData?.emergencyContact?.secondaryEmail}
                onChange={(e) =>
                  handleInputChange("secondaryEmail", e?.target?.value)
                }
                description="Optional email for notifications"
              />
            </div>
          </div>
        )}

        {/* Emergency Contact Guidelines */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-accent mb-2">
                Emergency Contact Guidelines
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Choose contacts who are easily reachable and available
                </li>
                <li>
                  • Inform contacts that they are listed as emergency contacts
                </li>
                <li>• Ensure contact information is current and accurate</li>
                <li>• Primary contact will be called first in emergencies</li>
                <li>
                  • Secondary contact serves as backup if primary is unavailable
                </li>
                <li>
                  • Contacts may be asked to make medical decisions if patient
                  cannot
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Medical Decision Making */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon
              name="AlertTriangle"
              size={20}
              className="text-warning mt-0.5"
            />
            <div>
              <h4 className="font-medium text-warning mb-2">
                Medical Decision Authority
              </h4>
              <p className="text-sm text-muted-foreground">
                Emergency contacts may be consulted for medical decisions if the
                patient is unable to communicate. Ensure contacts understand
                this responsibility and are comfortable making healthcare
                decisions on behalf of the patient.
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
            Back to Photo Capture
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

        <Button
          onClick={onNext}
          disabled={!validateStep()}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Medical History
        </Button>
      </div>
    </div>
  );
};

export default EmergencyContactStep;

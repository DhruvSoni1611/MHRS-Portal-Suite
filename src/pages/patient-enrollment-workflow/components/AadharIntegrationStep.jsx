import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const AadharIntegrationStep = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrevious,
  onSave,
}) => {
  const [integrationMode, setIntegrationMode] = useState("link"); // 'link', 'create', 'skip'
  const [otpSent, setOtpSent] = useState(false);
  const [verificationStep, setVerificationStep] = useState("mobile"); // 'mobile', 'otp', 'verified'

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      abha: {
        ...prev?.abha,
        [field]: value,
      },
    }));
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setVerificationStep("otp");
    // Mock OTP sending
    setTimeout(() => {
      alert("OTP sent to registered mobile number");
    }, 500);
  };

  const handleVerifyOtp = () => {
    if (formData?.abha?.otp === "123456") {
      setVerificationStep("verified");
      handleInputChange("isVerified", true);
      handleInputChange("abhaNumber", "ABHA-1234-5678-9012");
    } else {
      alert("Invalid OTP. Please use 123456 for demo");
    }
  };

  const validateStep = () => {
    if (integrationMode === "skip") return true;
    if (integrationMode === "link") {
      return formData?.abha?.existingAbhaNumber && formData?.abha?.isVerified;
    }
    if (integrationMode === "create") {
      return formData?.abha?.isVerified;
    }
    return false;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          ABHA Integration
        </h3>
        <p className="text-muted-foreground">
          Ayushman Bharat Health Account (ABHA) provides a unique health
          identity for seamless healthcare access across India.
        </p>
      </div>
      {/* Integration Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setIntegrationMode("link")}
          className={`p-4 border rounded-lg text-left transition-clinical ${
            integrationMode === "link"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Icon name="Link" size={20} className="mb-2" />
          <h4 className="font-medium mb-1">Link Existing ABHA</h4>
          <p className="text-sm text-muted-foreground">
            Patient already has an ABHA number
          </p>
        </button>

        <button
          onClick={() => setIntegrationMode("create")}
          className={`p-4 border rounded-lg text-left transition-clinical ${
            integrationMode === "create"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Icon name="Plus" size={20} className="mb-2" />
          <h4 className="font-medium mb-1">Create New ABHA</h4>
          <p className="text-sm text-muted-foreground">
            Generate new ABHA for patient
          </p>
        </button>

        <button
          onClick={() => setIntegrationMode("skip")}
          className={`p-4 border rounded-lg text-left transition-clinical ${
            integrationMode === "skip"
              ? "border-warning bg-warning/5 text-warning"
              : "border-border hover:border-warning/50"
          }`}
        >
          <Icon name="SkipForward" size={20} className="mb-2" />
          <h4 className="font-medium mb-1">Skip for Now</h4>
          <p className="text-sm text-muted-foreground">
            Continue without ABHA integration
          </p>
        </button>
      </div>
      {/* Link Existing ABHA */}
      {integrationMode === "link" && (
        <div className="space-y-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">
              Link Existing ABHA Account
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the patient's existing ABHA number to link their health
              records.
            </p>

            <Input
              label="ABHA Number"
              type="text"
              placeholder="XX-XXXX-XXXX-XXXX"
              value={formData?.abha?.existingAbhaNumber}
              onChange={(e) =>
                handleInputChange("existingAbhaNumber", e?.target?.value)
              }
              error={errors?.existingAbhaNumber}
              description="14-digit ABHA number (with or without hyphens)"
              required
            />

            {formData?.abha?.existingAbhaNumber &&
              !formData?.abha?.isVerified && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleSendOtp}
                    iconName="Send"
                    iconPosition="right"
                  >
                    Verify ABHA Number
                  </Button>
                </div>
              )}

            {otpSent && verificationStep === "otp" && (
              <div className="mt-4 space-y-4">
                <Input
                  label="OTP Verification"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData?.abha?.otp}
                  onChange={(e) => handleInputChange("otp", e?.target?.value)}
                  description="OTP sent to registered mobile number (Use 123456 for demo)"
                  maxLength={6}
                />
                <Button
                  onClick={handleVerifyOtp}
                  disabled={
                    !formData?.abha?.otp || formData?.abha?.otp?.length !== 6
                  }
                  iconName="Check"
                  iconPosition="right"
                >
                  Verify OTP
                </Button>
              </div>
            )}

            {verificationStep === "verified" && (
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">
                    ABHA Account Verified Successfully
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ABHA Number: {formData?.abha?.abhaNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Create New ABHA */}
      {integrationMode === "create" && (
        <div className="space-y-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">
              Create New ABHA Account
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              We'll create a new ABHA account using the patient's demographic
              information.
            </p>

            {verificationStep === "mobile" && (
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-accent">
                    Mobile verification required for ABHA creation:{" "}
                    {formData?.demographics?.phoneNumber}
                  </p>
                </div>
                <Button
                  onClick={handleSendOtp}
                  iconName="Send"
                  iconPosition="right"
                >
                  Send OTP for Verification
                </Button>
              </div>
            )}

            {otpSent && verificationStep === "otp" && (
              <div className="space-y-4">
                <Input
                  label="Mobile OTP"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData?.abha?.otp}
                  onChange={(e) => handleInputChange("otp", e?.target?.value)}
                  description="OTP sent to patient's mobile number (Use 123456 for demo)"
                  maxLength={6}
                />
                <Button
                  onClick={handleVerifyOtp}
                  disabled={
                    !formData?.abha?.otp || formData?.abha?.otp?.length !== 6
                  }
                  iconName="Check"
                  iconPosition="right"
                >
                  Create ABHA Account
                </Button>
              </div>
            )}

            {verificationStep === "verified" && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">
                    New ABHA Account Created Successfully
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ABHA Number: {formData?.abha?.abhaNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Skip Integration */}
      {integrationMode === "skip" && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon
              name="AlertTriangle"
              size={20}
              className="text-warning mt-0.5"
            />
            <div>
              <h4 className="font-medium text-warning mb-1">
                ABHA Integration Skipped
              </h4>
              <p className="text-sm text-muted-foreground">
                The patient can be enrolled without ABHA integration. However,
                they will miss out on:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>
                  • Seamless health record portability across healthcare
                  providers
                </li>
                <li>• Digital health card and QR code access</li>
                <li>• Integration with national health programs</li>
                <li>• Telemedicine and digital prescription benefits</li>
              </ul>
              <p className="text-sm text-accent mt-3">
                ABHA can be added later through the patient profile.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Demographics
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
          Continue to Photo Capture
        </Button>
      </div>
    </div>
  );
};

export default AadharIntegrationStep;

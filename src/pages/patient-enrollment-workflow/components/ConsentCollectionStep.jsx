import React, { useState } from "react";
import { Checkbox } from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const ConsentCollectionStep = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrevious,
  onSave,
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(
    formData?.consent?.isVerified || false
  );

  const consentItems = [
    {
      id: "data-processing",
      title: "Data Processing Consent",
      description:
        "I consent to the collection, processing, and storage of my personal and medical information for healthcare purposes.",
      required: true,
      details: `This includes:
• Personal demographic information
• Medical history and health records
• Treatment and diagnostic information
• Insurance and billing information
• Communication preferences`,
    },
    {
      id: "treatment-consent",
      title: "Treatment Consent",
      description:
        "I consent to receive medical treatment and care from authorized healthcare providers.",
      required: true,
      details: `This includes:
• Medical examinations and assessments
• Diagnostic tests and procedures
• Treatment recommendations and interventions
• Medication administration
• Emergency medical care when necessary`,
    },
    {
      id: "information-sharing",
      title: "Information Sharing Consent",
      description:
        "I consent to sharing my medical information with authorized healthcare providers and systems.",
      required: true,
      details: `Information may be shared with:
• Healthcare providers involved in my care
• Laboratory and diagnostic services
• Insurance providers for billing purposes
• Government health authorities as required by law
• Emergency contacts in case of medical emergencies`,
    },
    {
      id: "digital-health",
      title: "Digital Health Services",
      description:
        "I consent to using digital health services including telemedicine and electronic health records.",
      required: false,
      details: `This includes:
• Electronic health record access
• Telemedicine consultations
• Digital prescription services
• Health monitoring applications
• SMS and email health notifications`,
    },
    {
      id: "research-participation",
      title: "Research Participation (Optional)",
      description:
        "I consent to the use of my de-identified health data for medical research purposes.",
      required: false,
      details: `This includes:
• Anonymous health data for research studies
• Population health analysis
• Treatment outcome studies
• Public health research
• Medical device and treatment effectiveness studies`,
    },
  ];

  const handleConsentChange = (consentId, checked) => {
    const currentConsents = formData?.consent?.items || [];
    const updatedConsents = checked
      ? [...currentConsents?.filter((id) => id !== consentId), consentId]
      : currentConsents?.filter((id) => id !== consentId);

    setFormData((prev) => ({
      ...prev,
      consent: {
        ...prev?.consent,
        items: updatedConsents,
      },
    }));
  };

  const handleOtpChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      consent: {
        ...prev?.consent,
        otp: value,
      },
    }));
  };

  const sendOtp = () => {
    setOtpSent(true);
    // Mock OTP sending
    setTimeout(() => {
      alert(
        `OTP sent to ${formData?.demographics?.phoneNumber}\nUse 123456 for demo`
      );
    }, 500);
  };

  const verifyOtp = () => {
    if (formData?.consent?.otp === "123456") {
      setOtpVerified(true);
      setFormData((prev) => ({
        ...prev,
        consent: {
          ...prev?.consent,
          isVerified: true,
          verifiedAt: new Date()?.toISOString(),
        },
      }));
    } else {
      alert("Invalid OTP. Please use 123456 for demo");
    }
  };

  const validateStep = () => {
    const requiredConsents = consentItems
      ?.filter((item) => item?.required)
      ?.map((item) => item?.id);
    const givenConsents = formData?.consent?.items || [];
    const hasRequiredConsents = requiredConsents?.every((id) =>
      givenConsents?.includes(id)
    );

    return hasRequiredConsents && otpVerified;
  };

  const requiredConsentsGiven = () => {
    const requiredConsents = consentItems
      ?.filter((item) => item?.required)
      ?.map((item) => item?.id);
    const givenConsents = formData?.consent?.items || [];
    return requiredConsents?.every((id) => givenConsents?.includes(id));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Consent Collection
        </h3>
        <p className="text-muted-foreground">
          Please review and provide consent for various aspects of healthcare
          services. Required consents are necessary to proceed with enrollment.
        </p>
      </div>
      <div className="space-y-6">
        {/* Consent Items */}
        {consentItems?.map((item) => {
          const isChecked = (formData?.consent?.items || [])?.includes(
            item?.id
          );

          return (
            <div
              key={item?.id}
              className="bg-muted/50 border border-border rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) =>
                      handleConsentChange(item?.id, e?.target?.checked)
                    }
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-foreground">
                      {item?.title}
                    </h4>
                    {item?.required && (
                      <span className="text-xs bg-error text-error-foreground px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {item?.description}
                  </p>

                  <details className="text-sm">
                    <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium">
                      View Details
                    </summary>
                    <div className="mt-2 p-3 bg-background border border-border rounded text-muted-foreground whitespace-pre-line">
                      {item?.details}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          );
        })}

        {/* OTP Verification */}
        {requiredConsentsGiven() && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={20} className="text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-primary mb-2">
                  Consent Verification Required
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  To complete the consent process, we need to verify your
                  identity using OTP sent to your registered mobile number.
                </p>

                {!otpSent ? (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">
                      OTP will be sent to:{" "}
                      <strong>{formData?.demographics?.phoneNumber}</strong>
                    </p>
                    <Button
                      onClick={sendOtp}
                      iconName="Send"
                      iconPosition="right"
                    >
                      Send OTP
                    </Button>
                  </div>
                ) : !otpVerified ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={formData?.consent?.otp || ""}
                        onChange={(e) => handleOtpChange(e?.target?.value)}
                        className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        maxLength={6}
                      />
                      <Button
                        onClick={verifyOtp}
                        disabled={
                          !formData?.consent?.otp ||
                          formData?.consent?.otp?.length !== 6
                        }
                        iconName="Check"
                        iconPosition="right"
                      >
                        Verify OTP
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use 123456 for demo purposes
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">
                      Consent verified successfully
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Legal Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon
              name="AlertTriangle"
              size={20}
              className="text-warning mt-0.5"
            />
            <div>
              <h4 className="font-medium text-warning mb-2">
                Important Legal Information
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You have the right to withdraw consent at any time</li>
                <li>
                  • Withdrawal may affect the quality of healthcare services
                </li>
                <li>• Your data is protected under applicable privacy laws</li>
                <li>• You can request access to or correction of your data</li>
                <li>• Contact our privacy officer for data-related queries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Consent Summary */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h4 className="font-medium text-accent mb-3">Consent Summary</h4>
          <div className="space-y-2">
            {consentItems?.map((item) => {
              const isGiven = (formData?.consent?.items || [])?.includes(
                item?.id
              );
              return (
                <div
                  key={item?.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item?.title}</span>
                  <div className="flex items-center space-x-2">
                    {isGiven ? (
                      <>
                        <Icon name="Check" size={14} className="text-success" />
                        <span className="text-success font-medium">
                          Granted
                        </span>
                      </>
                    ) : (
                      <>
                        <Icon
                          name="X"
                          size={14}
                          className="text-muted-foreground"
                        />
                        <span className="text-muted-foreground">
                          Not granted
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
            Back to Medical History
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
          Complete Enrollment
        </Button>
      </div>
    </div>
  );
};

export default ConsentCollectionStep;

import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import StepIndicator from "./components/StepIndicator";
import DemographicsStep from "./components/DemographicsStep";
import AadharIntegrationStep from "./components/AadharIntegrationStep";
import PhotoCaptureStep from "./components/PhotoCaptureStep";
import EmergencyContactStep from "./components/EmergencyContactStep";
import MedicalHistoryStep from "./components/MedicalHistoryStep";
import ConsentCollectionStep from "./components/ConsentCollectionStep";
import CompletionStep from "./components/CompletionStep";

const PatientEnrollmentWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    demographics: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
    },
    abha: {
      existingAbhaNumber: "",
      abhaNumber: "",
      otp: "",
      isVerified: false,
    },
    photo: null,
    emergencyContact: {
      primaryName: "",
      primaryPhone: "",
      primaryRelationship: "",
      primaryEmail: "",
      primaryAddress: "",
      hasSecondary: false,
      secondaryName: "",
      secondaryPhone: "",
      secondaryRelationship: "",
      secondaryEmail: "",
    },
    medicalHistory: {
      bloodGroup: "",
      height: "",
      weight: "",
      bmi: "",
      conditions: [],
      otherConditions: "",
      hasAllergies: false,
      allergies: [],
      allergyDetails: "",
      hasCurrentMedications: false,
      currentMedications: [],
      familyHistory: "",
      additionalNotes: "",
    },
    consent: {
      items: [],
      otp: "",
      isVerified: false,
      verifiedAt: null,
    },
  });
  const [errors, setErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);

  const steps = [
    { id: 1, title: "Demographics", component: "demographics" },
    { id: 2, title: "ABHA Integration", component: "abha" },
    { id: 3, title: "Photo Capture", component: "photo" },
    { id: 4, title: "Emergency Contact", component: "emergency" },
    { id: 5, title: "Medical History", component: "medical" },
    { id: 6, title: "Consent Collection", component: "consent" },
    { id: 7, title: "Completion", component: "completion" },
  ];

  // Load draft data on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("patientEnrollmentDraft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft?.formData);
        setCurrentStep(parsedDraft?.currentStep);
        setDraftSaved(true);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, currentStep]);

  const saveDraft = () => {
    try {
      const draftData = {
        formData,
        currentStep,
        savedAt: new Date()?.toISOString(),
      };
      localStorage.setItem("patientEnrollmentDraft", JSON.stringify(draftData));
      setDraftSaved(true);

      // Show temporary save confirmation
      setTimeout(() => setDraftSaved(false), 2000);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("patientEnrollmentDraft");
    setDraftSaved(false);
  };

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleStartNew = () => {
    setCurrentStep(1);
    setFormData({
      demographics: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
      },
      abha: {
        existingAbhaNumber: "",
        abhaNumber: "",
        otp: "",
        isVerified: false,
      },
      photo: null,
      emergencyContact: {
        primaryName: "",
        primaryPhone: "",
        primaryRelationship: "",
        primaryEmail: "",
        primaryAddress: "",
        hasSecondary: false,
        secondaryName: "",
        secondaryPhone: "",
        secondaryRelationship: "",
        secondaryEmail: "",
      },
      medicalHistory: {
        bloodGroup: "",
        height: "",
        weight: "",
        bmi: "",
        conditions: [],
        otherConditions: "",
        hasAllergies: false,
        allergies: [],
        allergyDetails: "",
        hasCurrentMedications: false,
        currentMedications: [],
        familyHistory: "",
        additionalNotes: "",
      },
      consent: {
        items: [],
        otp: "",
        isVerified: false,
        verifiedAt: null,
      },
    });
    setErrors({});
    clearDraft();
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      setFormData,
      errors,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSave: saveDraft,
    };

    switch (currentStep) {
      case 1:
        return <DemographicsStep {...stepProps} />;
      case 2:
        return <AadharIntegrationStep {...stepProps} />;
      case 3:
        return <PhotoCaptureStep {...stepProps} />;
      case 4:
        return <EmergencyContactStep {...stepProps} />;
      case 5:
        return <MedicalHistoryStep {...stepProps} />;
      case 6:
        return <ConsentCollectionStep {...stepProps} />;
      case 7:
        return (
          <CompletionStep
            formData={formData}
            onPrevious={handlePrevious}
            onStartNew={handleStartNew}
          />
        );
      default:
        return <DemographicsStep {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="clinic-staff"
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Patient Enrollment Workflow
                </h1>
                <p className="text-muted-foreground">
                  Complete patient registration with demographic capture, ABHA
                  integration, and consent collection
                </p>
              </div>

              {draftSaved && (
                <div className="flex items-center space-x-2 text-success text-sm">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>Draft saved automatically</span>
                </div>
              )}
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={steps?.length}
            steps={steps}
          />

          {/* Current Step Content */}
          <div className="mb-6">{renderCurrentStep()}</div>

          {/* Help Section */}
          {currentStep < steps?.length && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-accent-foreground font-bold">
                    ?
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-accent mb-1">Need Help?</h4>
                  <p className="text-sm text-muted-foreground">
                    If you encounter any issues during enrollment, contact the
                    IT support team at ext. 2345 or use the help chat in the
                    bottom right corner. Your progress is automatically saved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientEnrollmentWorkflow;

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Save,
  Mic,
  FileText,
  User,
  Activity,
  Clipboard,
  Calendar,
  Clock,
} from "lucide-react";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import ChiefComplaintSection from "./components/VitalSignSection";
import PresentIllnessSection from "./components/PresentIllnessSection";
import PhysicalExaminationSection from "./components/PhysicalExaminationSection";
import VitalSignsSection from "./components/VitalSignSection";
import TreatmentPlanSection from "./components/TreatmentPlanSection";
import ICDCodeSearch from "./components/ICDCodeSeach";
import Icon from "../../components/AppIcon";

const ClinicalEncounterForm = () => {
  const [activeTab, setActiveTab] = useState("chief-complaint");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedIcdCodes, setSelectedIcdCodes] = useState([]);
  const [isDraft, setIsDraft] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      patientId: "P-001",
      encounterDate: new Date()?.toISOString()?.split("T")?.[0],
      encounterTime: new Date()?.toTimeString()?.slice(0, 5),
      provider: "Dr. Sarah Johnson",
      chiefComplaint: "",
      presentIllness: "",
      physicalExamination: {},
      vitalSigns: {
        temperature: "",
        bloodPressure: "",
        pulse: "",
        respiratoryRate: "",
      },
      treatmentPlan: {
        medications: [],
        procedures: [],
        followUp: "",
      },
    },
  });

  const tabs = [
    { id: "chief-complaint", label: "Chief Complaint", icon: User },
    { id: "present-illness", label: "Present Illness", icon: FileText },
    { id: "physical-exam", label: "Physical Exam", icon: Activity },
    { id: "vital-signs", label: "Vital Signs", icon: Activity },
    { id: "treatment-plan", label: "Treatment Plan", icon: Clipboard },
    { id: "diagnosis", label: "Diagnosis & ICD", icon: FileText },
  ];

  const handleVoiceRecording = useCallback(() => {
    setIsRecording(!isRecording);
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event?.resultIndex; i < event?.results?.length; i++) {
          transcript += event?.results?.[i]?.[0]?.transcript;
        }

        // Update the current active field
        const currentValue = watch(getActiveField()) || "";
        setValue(getActiveField(), currentValue + " " + transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      if (!isRecording) {
        recognition?.start();
      } else {
        recognition?.stop();
      }
    }
  }, [isRecording, setValue, watch]);

  const getActiveField = () => {
    switch (activeTab) {
      case "chief-complaint":
        return "chiefComplaint";
      case "present-illness":
        return "presentIllness";
      default:
        return "chiefComplaint";
    }
  };

  const onSubmitDraft = (data) => {
    setIsDraft(true);
    console.log("Saving as draft:", data);
    // Handle draft save
  };

  const onSubmitFinal = (data) => {
    setIsDraft(false);
    console.log("Final submission:", { ...data, icdCodes: selectedIcdCodes });
    // Handle final submission
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "chief-complaint":
        return (
          <ChiefComplaintSection
            register={register}
            errors={errors}
            watch={watch}
          />
        );
      case "present-illness":
        return (
          <PresentIllnessSection
            register={register}
            errors={errors}
            watch={watch}
          />
        );
      case "physical-exam":
        return (
          <PhysicalExaminationSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        );
      case "vital-signs":
        return (
          <VitalSignsSection
            register={register}
            errors={errors}
            watch={watch}
          />
        );
      case "treatment-plan":
        return (
          <TreatmentPlanSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        );
      case "diagnosis":
        return (
          <ICDCodeSearch
            selectedCodes={selectedIcdCodes}
            onCodesChange={setSelectedIcdCodes}
            watch={watch}
          />
        );
      default:
        return (
          <ChiefComplaintSection
            register={register}
            errors={errors}
            watch={watch}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Clinical Encounter Form" onMenuToggle={() => {}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Date: {watch("encounterDate")}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Time: {watch("encounterTime")}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Provider: {watch("provider")}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                onClick={handleVoiceRecording}
                className={`px-4 py-2 rounded-md flex items-center ${
                  isRecording
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                <Mic
                  className={`h-4 w-4 mr-2 ${
                    isRecording ? "animate-pulse" : ""
                  }`}
                />
                {isRecording ? "Recording..." : "Voice Input"}
              </Button>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDraft
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isDraft ? "Draft" : "Final"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs?.map((tab) => {
                  const Icon = tab?.icon;
                  return (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab?.id
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab?.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form className="bg-white rounded-lg shadow-sm">
              <div className="p-6">{renderTabContent()}</div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
                <div className="text-sm text-gray-500">
                  {isDirty ? "Unsaved changes" : "All changes saved"}
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmitDraft)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmitFinal)}
                    disabled={!isValid}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Complete Encounter
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalEncounterForm;

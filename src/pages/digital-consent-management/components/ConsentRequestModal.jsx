import React, { useState, useEffect } from "react";
import {
  X,
  User,
  FileText,
  Phone,
  Shield,
  CheckCircle,
  Send,
  AlertTriangle,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const ConsentRequestModal = ({ consent, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    consentType: "",
    language: "en",
    collectionMethod: "digital",
    expiryDate: "",
    notes: "",
    requiresGuardianConsent: false,
    guardianName: "",
    guardianRelation: "",
    otpPhone: "",
    otpSent: false,
    otpVerified: false,
    otpCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (consent) {
      setFormData({
        patientId: consent?.patientId || "",
        patientName: consent?.patientName || "",
        consentType: consent?.type || "",
        language: "en",
        collectionMethod: consent?.collectionMethod || "digital",
        expiryDate: consent?.expiryDate || "",
        notes: consent?.notes || "",
        requiresGuardianConsent: consent?.consentBy === "Legal Guardian",
        guardianName:
          consent?.consentBy === "Legal Guardian" ? consent?.consentBy : "",
        guardianRelation: "",
        otpPhone: "",
        otpSent: false,
        otpVerified: consent?.collectionMethod === "digital",
        otpCode: "",
      });
    }
  }, [consent]);

  const consentTypes = [
    {
      value: "treatment",
      label: "Treatment Authorization",
      description: "Consent for medical treatment and procedures",
      requiredFields: ["patientId", "consentType"],
    },
    {
      value: "data-sharing",
      label: "Data Sharing",
      description: "Permission to share medical data with other providers",
      requiredFields: ["patientId", "consentType", "expiryDate"],
    },
    {
      value: "research",
      label: "Research Participation",
      description: "Consent to participate in medical research studies",
      requiredFields: ["patientId", "consentType", "expiryDate", "notes"],
    },
    {
      value: "telehealth",
      label: "Telehealth Services",
      description: "Consent for remote healthcare services",
      requiredFields: ["patientId", "consentType"],
    },
    {
      value: "marketing",
      label: "Marketing Communications",
      description: "Permission to receive marketing communications",
      requiredFields: ["patientId", "consentType", "expiryDate"],
    },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "te", label: "Telugu" },
    { value: "ta", label: "Tamil" },
    { value: "bn", label: "Bengali" },
    { value: "mr", label: "Marathi" },
  ];

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData?.patientId) newErrors.patientId = "Patient ID is required";
      if (!formData?.patientName)
        newErrors.patientName = "Patient name is required";
      if (!formData?.consentType)
        newErrors.consentType = "Consent type is required";
    }

    if (stepNumber === 2 && formData?.collectionMethod === "otp") {
      if (!formData?.otpPhone)
        newErrors.otpPhone = "Phone number is required for OTP";
      if (formData?.otpSent && !formData?.otpCode)
        newErrors.otpCode = "OTP code is required";
    }

    if (stepNumber === 2 && formData?.requiresGuardianConsent) {
      if (!formData?.guardianName)
        newErrors.guardianName = "Guardian name is required";
      if (!formData?.guardianRelation)
        newErrors.guardianRelation = "Guardian relation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const sendOTP = async () => {
    if (!formData?.otpPhone) {
      setErrors({ otpPhone: "Phone number is required" });
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, otpSent: true }));
      setIsLoading(false);
    }, 2000);
  };

  const verifyOTP = async () => {
    if (!formData?.otpCode || formData?.otpCode?.length !== 6) {
      setErrors({ otpCode: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, otpVerified: true }));
      setErrors({});
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const consentData = {
        ...formData,
        id: consent?.id || `CON-${Date.now()}`,
        status:
          formData?.collectionMethod === "otp" && !formData?.otpVerified
            ? "pending"
            : "active",
        collectedDate: new Date()?.toISOString()?.split("T")?.[0],
        version: "2.1",
      };

      onSave(consentData);
      setIsLoading(false);
    }, 2000);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Patient & Consent Details";
      case 2:
        return "Collection Method & Verification";
      case 3:
        return "Review & Submit";
      default:
        return "Consent Request";
    }
  };

  const selectedConsentType = consentTypes?.find(
    (type) => type?.value === formData?.consentType
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {consent ? "Edit Consent" : "New Consent Request"}
                </h3>
                <p className="text-sm text-gray-500">{getStepTitle()}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-center">
              {[1, 2, 3]?.map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step >= stepNumber
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }`}
                  >
                    {step > stepNumber ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        step > stepNumber ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {/* Step 1: Patient & Consent Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="patientId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Patient ID *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="patientId"
                        value={formData?.patientId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            patientId: e?.target?.value,
                          }))
                        }
                        className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors?.patientId
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter patient ID"
                      />
                    </div>
                    {errors?.patientId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors?.patientId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="patientName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      id="patientName"
                      value={formData?.patientName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          patientName: e?.target?.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors?.patientName
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter patient name"
                    />
                    {errors?.patientName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors?.patientName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Consent Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {consentTypes?.map((type) => (
                      <label key={type?.value} className="relative">
                        <input
                          type="radio"
                          name="consentType"
                          value={type?.value}
                          checked={formData?.consentType === type?.value}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              consentType: e?.target?.value,
                            }))
                          }
                          className="sr-only"
                        />
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData?.consentType === type?.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 mr-3 ${
                                formData?.consentType === type?.value
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {formData?.consentType === type?.value && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {type?.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {type?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors?.consentType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors?.consentType}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      value={formData?.language}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          language: e?.target?.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {languages?.map((lang) => (
                        <option key={lang?.value} value={lang?.value}>
                          {lang?.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Expiry Date{" "}
                      {selectedConsentType?.requiredFields?.includes(
                        "expiryDate"
                      ) && "*"}
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      value={formData?.expiryDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expiryDate: e?.target?.value,
                        }))
                      }
                      min={new Date()?.toISOString()?.split("T")?.[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData?.requiresGuardianConsent}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          requiresGuardianConsent: e?.target?.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Requires guardian/legal representative consent
                    </span>
                  </label>
                </div>

                {formData?.requiresGuardianConsent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <label
                        htmlFor="guardianName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Guardian Name *
                      </label>
                      <input
                        type="text"
                        id="guardianName"
                        value={formData?.guardianName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            guardianName: e?.target?.value,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors?.guardianName
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter guardian name"
                      />
                      {errors?.guardianName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors?.guardianName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="guardianRelation"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Relation to Patient *
                      </label>
                      <select
                        id="guardianRelation"
                        value={formData?.guardianRelation}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            guardianRelation: e?.target?.value,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors?.guardianRelation
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select relation</option>
                        <option value="parent">Parent</option>
                        <option value="spouse">Spouse</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Adult Child</option>
                        <option value="legal-guardian">Legal Guardian</option>
                        <option value="power-of-attorney">
                          Power of Attorney
                        </option>
                      </select>
                      {errors?.guardianRelation && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors?.guardianRelation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Collection Method & Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Collection Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        value: "digital",
                        label: "Digital Signature",
                        icon: FileText,
                        description: "Electronic signature capture",
                      },
                      {
                        value: "otp",
                        label: "OTP Verification",
                        icon: Phone,
                        description: "SMS-based verification",
                      },
                      {
                        value: "paper",
                        label: "Paper Form",
                        icon: FileText,
                        description: "Physical document",
                      },
                    ]?.map((method) => {
                      const Icon = method?.icon;
                      return (
                        <label key={method?.value} className="relative">
                          <input
                            type="radio"
                            name="collectionMethod"
                            value={method?.value}
                            checked={
                              formData?.collectionMethod === method?.value
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                collectionMethod: e?.target?.value,
                                otpSent: false,
                                otpVerified: false,
                              }))
                            }
                            className="sr-only"
                          />
                          <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData?.collectionMethod === method?.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="text-center">
                              <Icon
                                className={`h-8 w-8 mx-auto mb-2 ${
                                  formData?.collectionMethod === method?.value
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <p className="text-sm font-medium text-gray-900">
                                {method?.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {method?.description}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* OTP Verification */}
                {formData?.collectionMethod === "otp" && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-yellow-800">
                          OTP Verification Required
                        </h4>
                        <div className="mt-3 space-y-3">
                          <div>
                            <label
                              htmlFor="otpPhone"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Phone Number *
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="tel"
                                id="otpPhone"
                                value={formData?.otpPhone}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    otpPhone: e?.target?.value,
                                  }))
                                }
                                className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors?.otpPhone
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                                placeholder="+91 9876543210"
                                disabled={formData?.otpSent}
                              />
                              <Button
                                type="button"
                                onClick={sendOTP}
                                disabled={
                                  isLoading ||
                                  !formData?.otpPhone ||
                                  formData?.otpSent
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {isLoading ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                {formData?.otpSent ? "OTP Sent" : "Send OTP"}
                              </Button>
                            </div>
                            {errors?.otpPhone && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors?.otpPhone}
                              </p>
                            )}
                          </div>

                          {formData?.otpSent && !formData?.otpVerified && (
                            <div>
                              <label
                                htmlFor="otpCode"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Enter 6-Digit OTP *
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  id="otpCode"
                                  value={formData?.otpCode}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      otpCode: e?.target?.value,
                                    }))
                                  }
                                  maxLength={6}
                                  className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors?.otpCode
                                      ? "border-red-300"
                                      : "border-gray-300"
                                  }`}
                                  placeholder="Enter OTP"
                                />
                                <Button
                                  type="button"
                                  onClick={verifyOTP}
                                  disabled={isLoading || !formData?.otpCode}
                                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                  {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Verify
                                </Button>
                              </div>
                              {errors?.otpCode && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors?.otpCode}
                                </p>
                              )}
                            </div>
                          )}

                          {formData?.otpVerified && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">
                                OTP Verified Successfully
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Additional Notes{" "}
                    {selectedConsentType?.requiredFields?.includes("notes") &&
                      "*"}
                  </label>
                  <textarea
                    id="notes"
                    value={formData?.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e?.target?.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional information or special requirements..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Review Consent Request
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">
                        Patient Information
                      </h5>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Patient ID:</dt>
                          <dd className="text-gray-900 font-medium">
                            {formData?.patientId}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Patient Name:</dt>
                          <dd className="text-gray-900 font-medium">
                            {formData?.patientName}
                          </dd>
                        </div>
                        {formData?.requiresGuardianConsent && (
                          <>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Guardian:</dt>
                              <dd className="text-gray-900 font-medium">
                                {formData?.guardianName}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Relation:</dt>
                              <dd className="text-gray-900 font-medium">
                                {formData?.guardianRelation}
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">
                        Consent Details
                      </h5>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Type:</dt>
                          <dd className="text-gray-900 font-medium">
                            {selectedConsentType?.label}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Language:</dt>
                          <dd className="text-gray-900 font-medium">
                            {
                              languages?.find(
                                (lang) => lang?.value === formData?.language
                              )?.label
                            }
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Collection:</dt>
                          <dd className="text-gray-900 font-medium">
                            {formData?.collectionMethod === "digital"
                              ? "Digital Signature"
                              : formData?.collectionMethod === "otp"
                              ? "OTP Verification"
                              : "Paper Form"}
                          </dd>
                        </div>
                        {formData?.expiryDate && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Expiry Date:</dt>
                            <dd className="text-gray-900 font-medium">
                              {formData?.expiryDate}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  {formData?.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-700 mb-2">Notes</h5>
                      <p className="text-sm text-gray-600">{formData?.notes}</p>
                    </div>
                  )}
                </div>

                {formData?.collectionMethod === "otp" &&
                  !formData?.otpVerified && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        <p className="text-sm text-yellow-800">
                          This consent request will be marked as{" "}
                          <strong>Pending</strong> until OTP verification is
                          completed.
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    (formData?.collectionMethod === "otp" &&
                      formData?.otpSent &&
                      !formData?.otpVerified)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {consent ? "Update Consent" : "Submit Request"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentRequestModal;

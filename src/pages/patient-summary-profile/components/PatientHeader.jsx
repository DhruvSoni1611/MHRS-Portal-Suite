import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const PatientHeader = ({
  patient,
  onNewEncounter,
  onRequestConsent,
  onScheduleAppointment,
}) => {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [consentStep, setConsentStep] = useState("request"); // request, otp, success

  const handleConsentRequest = () => {
    setShowConsentModal(true);
    setConsentStep("request");
  };

  const handleSendOtp = () => {
    setConsentStep("otp");
  };

  const handleVerifyOtp = () => {
    if (otpValue === "123456") {
      setConsentStep("success");
      setTimeout(() => {
        setShowConsentModal(false);
        setConsentStep("request");
        setOtpValue("");
      }, 2000);
    }
  };

  const getConsentStatusColor = (status) => {
    switch (status) {
      case "granted":
        return "text-success bg-success/10";
      case "pending":
        return "text-warning bg-warning/10";
      case "expired":
        return "text-error bg-error/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Patient Photo and Basic Info */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                <Image
                  src={patient?.photo}
                  alt={`${patient?.name} profile photo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
                <Icon name="Check" size={12} color="white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {patient?.name}
                </h1>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getConsentStatusColor(
                    patient?.consentStatus
                  )}`}
                >
                  {patient?.consentStatus === "granted" && "Consent Granted"}
                  {patient?.consentStatus === "pending" && "Consent Pending"}
                  {patient?.consentStatus === "expired" && "Consent Expired"}
                  {patient?.consentStatus === "not_requested" && "No Consent"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Age/Gender:</span>
                  <p className="font-medium text-foreground">
                    {patient?.age} years, {patient?.gender}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">ABHA ID:</span>
                  <p className="font-medium text-foreground font-mono">
                    {patient?.abhaId}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium text-foreground">
                    {patient?.phone}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Patient Token:</span>
                  <p className="font-medium text-foreground font-mono">
                    {patient?.token}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Icon
                    name="MapPin"
                    size={14}
                    className="text-muted-foreground"
                  />
                  <span className="text-muted-foreground">
                    {patient?.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    name="Calendar"
                    size={14}
                    className="text-muted-foreground"
                  />
                  <span className="text-muted-foreground">
                    DOB: {patient?.dateOfBirth}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={onNewEncounter}
              className="w-full sm:w-auto lg:w-full"
            >
              New Encounter
            </Button>

            <Button
              variant="outline"
              iconName="FileText"
              iconPosition="left"
              onClick={handleConsentRequest}
              disabled={patient?.consentStatus === "granted"}
              className="w-full sm:w-auto lg:w-full"
            >
              {patient?.consentStatus === "granted"
                ? "Consent Active"
                : "Request Consent"}
            </Button>

            <Button
              variant="secondary"
              iconName="Calendar"
              iconPosition="left"
              onClick={onScheduleAppointment}
              className="w-full sm:w-auto lg:w-full"
            >
              Schedule Appointment
            </Button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">
                Last synced: {patient?.lastSync}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Patient ID: {patient?.id}
              </span>
              <span className="text-muted-foreground">
                Registration: {patient?.registrationDate}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Consent Request Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
          <div className="bg-card rounded-lg shadow-clinical-lg max-w-md w-full p-6">
            {consentStep === "request" && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Request Patient Consent
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Digital consent for data sharing
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-foreground mb-4">
                    Request digital consent from{" "}
                    <strong>{patient?.name}</strong> to access and share their
                    health records for treatment purposes.
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      An OTP will be sent to {patient?.phone} for verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConsentModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSendOtp}
                    className="flex-1"
                  >
                    Send OTP
                  </Button>
                </div>
              </>
            )}

            {consentStep === "otp" && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon
                      name="Smartphone"
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Verify OTP
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the code sent to {patient?.phone}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e?.target?.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-border rounded-md text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Demo OTP: 123456
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setConsentStep("request")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleVerifyOtp}
                    disabled={otpValue?.length !== 6}
                    className="flex-1"
                  >
                    Verify
                  </Button>
                </div>
              </>
            )}

            {consentStep === "success" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Consent Granted
                </h3>
                <p className="text-sm text-muted-foreground">
                  Patient consent has been successfully verified and granted.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PatientHeader;

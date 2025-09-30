import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const CompletionStep = ({ formData, onPrevious, onStartNew }) => {
  const [patientToken, setPatientToken] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate patient token and QR code generation
    setTimeout(() => {
      const token = `PT${Date.now()?.toString()?.slice(-8)}`;
      setPatientToken(token);
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${token}`
      );
      setIsGenerating(false);
    }, 2000);
  }, []);

  const handlePrintCard = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `patient-qr-${patientToken}.png`;
    link?.click();
  };

  const handleViewProfile = () => {
    window.location.href = "/patient-summary-profile";
  };

  const handleBackToDashboard = () => {
    window.location.href = "/multi-portal-dashboard";
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today?.getFullYear() - birthDate?.getFullYear();
    const monthDiff = today?.getMonth() - birthDate?.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today?.getDate() < birthDate?.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Enrollment Completed Successfully!
        </h3>
        <p className="text-muted-foreground">
          The patient has been successfully enrolled in the MHRS system. All
          information has been saved and verified.
        </p>
      </div>
      {isGenerating ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Generating patient token and QR code...
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Patient Summary Card */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-start space-x-6">
              {/* Patient Photo */}
              <div className="flex-shrink-0">
                {formData?.photo?.url ? (
                  <div className="w-24 h-24 border-2 border-primary rounded-lg overflow-hidden">
                    <Image
                      src={formData?.photo?.url}
                      alt="Patient photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-muted border-2 border-border rounded-lg flex items-center justify-center">
                    <Icon
                      name="User"
                      size={32}
                      className="text-muted-foreground"
                    />
                  </div>
                )}
              </div>

              {/* Patient Details */}
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  {formData?.demographics?.firstName}{" "}
                  {formData?.demographics?.lastName}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Patient Token:
                    </span>
                    <span className="ml-2 font-mono font-semibold text-primary">
                      {patientToken}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <span className="ml-2 font-medium">
                      {getAge(formData?.demographics?.dateOfBirth)} years
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="ml-2 font-medium capitalize">
                      {formData?.demographics?.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="ml-2 font-medium">
                      {formData?.demographics?.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blood Group:</span>
                    <span className="ml-2 font-medium">
                      {formData?.medicalHistory?.bloodGroup || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ABHA:</span>
                    <span className="ml-2 font-medium">
                      {formData?.abha?.abhaNumber || "Not linked"}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="ml-2 text-sm">
                    {formData?.demographics?.addressLine1},{" "}
                    {formData?.demographics?.city},{" "}
                    {formData?.demographics?.state} -{" "}
                    {formData?.demographics?.pinCode}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex-shrink-0 text-center">
                <div className="w-24 h-24 border border-border rounded-lg overflow-hidden bg-white p-2">
                  <Image
                    src={qrCodeUrl}
                    alt="Patient QR Code"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Patient QR Code
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
              <Icon
                name="User"
                size={24}
                className="text-primary mx-auto mb-2"
              />
              <h5 className="font-medium text-foreground mb-1">Demographics</h5>
              <p className="text-sm text-success">✓ Complete</p>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
              <Icon
                name="Shield"
                size={24}
                className="text-primary mx-auto mb-2"
              />
              <h5 className="font-medium text-foreground mb-1">
                ABHA Integration
              </h5>
              <p className="text-sm text-success">
                {formData?.abha?.abhaNumber ? "✓ Linked" : "⚠ Skipped"}
              </p>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
              <Icon
                name="FileText"
                size={24}
                className="text-primary mx-auto mb-2"
              />
              <h5 className="font-medium text-foreground mb-1">Consent</h5>
              <p className="text-sm text-success">✓ Verified</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-accent mb-2">Next Steps</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Patient can now be searched using token:{" "}
                    <strong>{patientToken}</strong>
                  </li>
                  <li>
                    • QR code can be used for quick patient identification
                  </li>
                  <li>
                    • Medical records can be accessed through patient profile
                  </li>
                  <li>• Emergency contacts have been notified of enrollment</li>
                  <li>• Digital health card is available for download</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={handleViewProfile}
              iconName="User"
              iconPosition="left"
              fullWidth
            >
              View Patient Profile
            </Button>

            <Button
              variant="outline"
              onClick={handlePrintCard}
              iconName="Printer"
              iconPosition="left"
              fullWidth
            >
              Print Patient Card
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadQR}
              iconName="Download"
              iconPosition="left"
              fullWidth
            >
              Download QR Code
            </Button>

            <Button
              variant="outline"
              onClick={onStartNew}
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Enroll New Patient
            </Button>
          </div>

          {/* System Information */}
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
            <p>
              Enrollment completed on {formatDate(new Date()?.toISOString())} at{" "}
              {new Date()?.toLocaleTimeString("en-IN")}
            </p>
            <p>
              System: MHRS Portal Suite v2.1 | Session ID:{" "}
              {Date.now()?.toString()?.slice(-8)}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
          disabled={isGenerating}
        >
          Back to Consent
        </Button>

        <Button
          onClick={handleBackToDashboard}
          iconName="Home"
          iconPosition="right"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;

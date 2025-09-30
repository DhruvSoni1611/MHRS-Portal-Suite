import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";

const OTPAuthForm = ({ onAuthSuccess, onBackToLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    portal: "clinic-staff",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const portalOptions = [
    {
      value: "clinic-staff",
      label: "Clinic Staff Portal",
      description: "Healthcare providers and clinical staff",
    },
    {
      value: "pho-official",
      label: "Public Health Official Portal",
      description: "Government health administrators",
    },
    {
      value: "lab-personnel",
      label: "Laboratory Personnel Portal",
      description: "Lab technicians and analysts",
    },
  ];

  // Mock phone numbers for different portals
  const mockPhoneNumbers = {
    "clinic-staff": "+91 98765 43210",
    "pho-official": "+91 87654 32109",
    "lab-personnel": "+91 76543 21098",
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePhone = () => {
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (!formData?.phone?.trim()) {
      setErrors({ phone: "Phone number is required" });
      return false;
    }
    if (!phoneRegex?.test(formData?.phone?.replace(/\s/g, ""))) {
      setErrors({ phone: "Please enter a valid Indian mobile number" });
      return false;
    }
    return true;
  };

  const validateOTP = () => {
    if (!formData?.otp?.trim()) {
      setErrors({ otp: "OTP is required" });
      return false;
    }
    if (formData?.otp?.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();

    if (!validatePhone()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const expectedPhone = mockPhoneNumbers?.[formData?.portal];

      if (
        formData?.phone?.replace(/\s/g, "") ===
        expectedPhone?.replace(/\s/g, "")
      ) {
        // Generate mock OTP
        const otp = Math.floor(100000 + Math.random() * 900000)?.toString();
        setGeneratedOTP(otp);
        setStep("otp");
        setCountdown(30);

        // Show success message with OTP for demo
        setErrors({
          success: `OTP sent successfully! Demo OTP: ${otp}`,
        });
      } else {
        setErrors({
          phone: `Phone number not registered. Use: ${expectedPhone}`,
        });
      }
    } catch (error) {
      setErrors({
        phone: "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();

    if (!validateOTP()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData?.otp === generatedOTP) {
        // Simulate JWT token storage
        localStorage.setItem("authToken", "mock-jwt-token-otp-" + Date.now());
        localStorage.setItem("userRole", formData?.portal);
        localStorage.setItem("userPhone", formData?.phone);

        onAuthSuccess?.(formData?.portal);
        navigate("/multi-portal-dashboard");
      } else {
        setErrors({
          otp: "Invalid OTP. Please check and try again.",
        });
      }
    } catch (error) {
      setErrors({
        otp: "OTP verification failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000)?.toString();
      setGeneratedOTP(otp);
      setCountdown(30);

      setErrors({
        success: `New OTP sent! Demo OTP: ${otp}`,
      });
    } catch (error) {
      setErrors({
        otp: "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-clinical-lg border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Smartphone" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {step === "phone" ? "Phone Verification" : "Enter OTP"}
          </h1>
          <p className="text-muted-foreground">
            {step === "phone"
              ? "We'll send a verification code to your registered mobile number"
              : `Enter the 6-digit code sent to ${formData?.phone}`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            {errors?.success && (
              <div className="bg-success/10 border border-success/20 rounded-md p-4">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="CheckCircle"
                    size={20}
                    className="text-success mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-success">{errors?.success}</p>
                </div>
              </div>
            )}

            <Select
              label="Select Portal"
              description="Choose your designated healthcare portal"
              options={portalOptions}
              value={formData?.portal}
              onChange={(value) => handleInputChange("portal", value)}
              required
            />

            <Input
              label="Mobile Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData?.phone}
              onChange={(e) => handleInputChange("phone", e?.target?.value)}
              error={errors?.phone}
              description="Enter your registered mobile number"
              required
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              iconName="Send"
              iconPosition="right"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {errors?.success && (
              <div className="bg-success/10 border border-success/20 rounded-md p-4">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="CheckCircle"
                    size={20}
                    className="text-success mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-success">{errors?.success}</p>
                </div>
              </div>
            )}

            <Input
              label="Enter OTP"
              type="text"
              placeholder="123456"
              value={formData?.otp}
              onChange={(e) =>
                handleInputChange(
                  "otp",
                  e?.target?.value?.replace(/\D/g, "")?.slice(0, 6)
                )
              }
              error={errors?.otp}
              description="Enter the 6-digit verification code"
              required
              maxLength={6}
            />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Didn't receive code?
              </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className={`font-medium transition-clinical ${
                  countdown > 0
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:text-primary/80"
                }`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              iconName="Shield"
              iconPosition="right"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={onBackToLogin}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPAuthForm;

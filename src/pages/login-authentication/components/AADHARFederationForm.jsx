import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";

const AADHARFederationForm = ({ onAuthSuccess, onBackToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    abhaId: "",
    portal: "clinic-staff",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Mock ABHA IDs for different portals
  const mockABHAIds = {
    "clinic-staff": "12-3456-7890-1234",
    "pho-official": "98-7654-3210-9876",
    "lab-personnel": "56-7890-1234-5678",
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateABHA = () => {
    const abhaRegex = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
    if (!formData?.abhaId?.trim()) {
      setErrors({ abhaId: "ABHA ID is required" });
      return false;
    }
    if (!abhaRegex?.test(formData?.abhaId)) {
      setErrors({ abhaId: "Please enter a valid ABHA ID (XX-XXXX-XXXX-XXXX)" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateABHA()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate ABHA federation API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const expectedABHA = mockABHAIds?.[formData?.portal];

      if (formData?.abhaId === expectedABHA) {
        // Simulate successful ABHA federation
        localStorage.setItem("authToken", "mock-jwt-token-abha-" + Date.now());
        localStorage.setItem("userRole", formData?.portal);
        localStorage.setItem("abhaId", formData?.abhaId);
        localStorage.setItem("authMethod", "abha-federation");

        onAuthSuccess?.(formData?.portal);
        navigate("/multi-portal-dashboard");
      } else {
        setErrors({
          abhaId: `ABHA ID not authorized for this portal. Use: ${expectedABHA}`,
        });
      }
    } catch (error) {
      setErrors({
        general:
          "ABHA federation failed. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatABHAId = (value) => {
    // Remove all non-digits
    const digits = value?.replace(/\D/g, "");

    // Format as XX-XXXX-XXXX-XXXX
    if (digits?.length <= 2) return digits;
    if (digits?.length <= 6)
      return `${digits?.slice(0, 2)}-${digits?.slice(2)}`;
    if (digits?.length <= 10)
      return `${digits?.slice(0, 2)}-${digits?.slice(2, 6)}-${digits?.slice(
        6
      )}`;
    return `${digits?.slice(0, 2)}-${digits?.slice(2, 6)}-${digits?.slice(
      6,
      10
    )}-${digits?.slice(10, 14)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-clinical-lg border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            ABHA Federation
          </h1>
          <p className="text-muted-foreground">
            Sign in using your Ayushman Bharat Health Account
          </p>

          {/* Government Badge */}
          <div className="inline-flex items-center space-x-2 mt-4 px-3 py-1 bg-gradient-to-r from-orange-100 to-green-100 rounded-full">
            <Icon name="Award" size={16} className="text-orange-600" />
            <span className="text-xs font-medium text-gray-700">
              Government of India
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors?.general && (
            <div className="bg-error/10 border border-error/20 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <Icon
                  name="AlertCircle"
                  size={20}
                  className="text-error mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-error">
                    Federation Failed
                  </p>
                  <p className="text-sm text-error/80 mt-1">
                    {errors?.general}
                  </p>
                </div>
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
            label="ABHA ID"
            type="text"
            placeholder="12-3456-7890-1234"
            value={formData?.abhaId}
            onChange={(e) =>
              handleInputChange("abhaId", formatABHAId(e?.target?.value))
            }
            error={errors?.abhaId}
            description="Enter your 14-digit ABHA ID"
            required
            maxLength={17} // Including hyphens
          />

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <Icon
                name="Info"
                size={20}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  About ABHA Federation
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Your ABHA ID enables secure access across all participating
                  healthcare facilities while maintaining your privacy and data
                  security.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="Shield"
            iconPosition="right"
            className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700"
          >
            {isLoading ? "Authenticating with ABHA..." : "Sign In with ABHA"}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Don't have an ABHA ID?
            </p>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="ExternalLink"
              iconPosition="right"
              onClick={() => window.open("https://abha.abdm.gov.in", "_blank")}
            >
              Create ABHA ID
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
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

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Award" size={12} />
              <span>Government Approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AADHARFederationForm;

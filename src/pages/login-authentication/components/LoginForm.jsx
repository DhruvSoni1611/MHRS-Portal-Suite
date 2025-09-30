import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { useAuth } from "../../../utils/auth.jsx";

const LoginForm = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

  // Mock credentials for different user types
  const mockCredentials = {
    "clinic-staff": {
      username: "clinic.staff@mhrs.gov",
      password: "clinic123",
    },
    "pho-official": { username: "pho.admin@mhrs.gov", password: "pho123" },
    "lab-personnel": { username: "lab.tech@mhrs.gov", password: "lab123" },
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.username?.trim()) {
      newErrors.username = "Username or email is required";
    } else if (
      !formData?.username?.includes("@") &&
      formData?.username?.length < 3
    ) {
      newErrors.username = "Please enter a valid email or username";
    }

    if (!formData?.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (formData?.password?.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData?.portal) {
      newErrors.portal = "Please select a portal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const expectedCredentials = mockCredentials?.[formData?.portal];

      if (
        formData?.username === expectedCredentials?.username &&
        formData?.password === expectedCredentials?.password
      ) {
        const token = "mock-jwt-token-" + Date.now();
        login(token, formData?.portal, formData?.username);
        onAuthSuccess?.(formData?.portal);
        navigate("/multi-portal-dashboard");
      } else {
        setErrors({
          general: `Invalid credentials. Use: ${expectedCredentials?.username} / ${expectedCredentials?.password}`,
        });
      }
    } catch (error) {
      setErrors({
        general:
          "Authentication failed. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-clinical-lg border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome to MHRS
          </h1>
          <p className="text-muted-foreground">
            Sign in to your healthcare portal
          </p>
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
                    Authentication Failed
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
            error={errors?.portal}
            required
          />

          <Input
            label="Username or Email"
            type="email"
            placeholder="Enter your username or email"
            value={formData?.username}
            onChange={(e) => handleInputChange("username", e?.target?.value)}
            error={errors?.username}
            required
            className="w-full"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange("password", e?.target?.value)}
            error={errors?.password}
            required
            className="w-full"
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-primary hover:text-primary/80 font-medium transition-clinical"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Need help accessing your account?
          </p>
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="Phone"
              iconPosition="left"
              onClick={() => {
                /* Handle support call */
              }}
            >
              Contact IT Support
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              iconName="HelpCircle"
              iconPosition="left"
              onClick={() => {
                /* Handle help */
              }}
            >
              View Help Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthMethodSelector from "./components/AuthMethodSelector";
import LoginForm from "./components/LoginForm";
import OTPAuthForm from "./components/OTPAuthForm";
import AADHARFederationForm from "./components/AADHARFederationForm";
import Icon from "../../components/AppIcon";
import { useAuth } from "../../utils/auth.jsx";

const LoginAuthentication = () => {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState("login");
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/multi-portal-dashboard");
      return;
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  const handleAuthSuccess = () => {
    localStorage.setItem("authTimestamp", new Date()?.toISOString());
    localStorage.setItem("lastActivity", Date.now()?.toString());
    navigate("/multi-portal-dashboard");
  };

  const handleMethodChange = (method) => {
    setAuthMethod(method);
  };

  const handleBackToLogin = () => {
    setAuthMethod("login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="Activity" size={32} color="white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading MHRS Portal
          </h2>
          <p className="text-muted-foreground">
            Initializing secure healthcare system...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-clinical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  MHRS Portal Suite
                </h1>
                <p className="text-xs text-muted-foreground">
                  Healthcare Management System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>
                  {new Date()?.toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical">
                <Icon name="HelpCircle" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* System Status Banner */}
          <div className="mb-8">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-success">
                    System Status: Online
                  </p>
                  <p className="text-xs text-success/80">
                    All healthcare portals are operational
                  </p>
                </div>
                <div className="ml-auto text-xs text-success/70">
                  Last updated: {new Date()?.toLocaleTimeString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Credentials Section */}
          <div className="max-w-4xl mx-auto mt-12 mb-12">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Demo Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="rounded-md border border-border p-4">
                  <p className="font-medium mb-2">Clinic Staff</p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    clinic.staff@mhrs.gov
                  </p>
                  <p>
                    <span className="text-muted-foreground">Password:</span>{" "}
                    clinic123
                  </p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <p className="font-medium mb-2">Public Health Official</p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    pho.admin@mhrs.gov
                  </p>
                  <p>
                    <span className="text-muted-foreground">Password:</span>{" "}
                    pho123
                  </p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <p className="font-medium mb-2">Laboratory Personnel</p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    lab.tech@mhrs.gov
                  </p>
                  <p>
                    <span className="text-muted-foreground">Password:</span>{" "}
                    lab123
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Select the matching portal before signing in.
              </p>
            </div>
          </div>

          {/* Authentication Method Selector */}
          <AuthMethodSelector
            activeMethod={authMethod}
            onMethodChange={handleMethodChange}
          />

          {/* Authentication Forms */}
          <div className="flex justify-center">
            {authMethod === "login" && (
              <LoginForm onAuthSuccess={handleAuthSuccess} />
            )}

            {authMethod === "otp" && (
              <OTPAuthForm
                onAuthSuccess={handleAuthSuccess}
                onBackToLogin={handleBackToLogin}
              />
            )}

            {authMethod === "abha" && (
              <AADHARFederationForm
                onAuthSuccess={handleAuthSuccess}
                onBackToLogin={handleBackToLogin}
              />
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Clinic Staff Portal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Patient management, encounter documentation, and clinical
                  workflows
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="BarChart3" size={24} className="text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  PHO Analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Public health monitoring, disease surveillance, and population
                  analytics
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="FlaskConical"
                    size={24}
                    className="text-secondary"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Lab Personnel
                </h3>
                <p className="text-sm text-muted-foreground">
                  Laboratory order management, result processing, and quality
                  control
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={20} color="white" />
                </div>
                <span className="font-semibold text-foreground">
                  MHRS Portal Suite
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive healthcare management system serving healthcare
                providers, public health officials, and laboratory personnel
                across India.
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>© {new Date()?.getFullYear()} Government of India</span>
                <span>•</span>
                <span>Ministry of Health & Family Welfare</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    Technical Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    Training Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    Data Protection
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-clinical"
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4 sm:mb-0">
                <div className="flex items-center space-x-1">
                  <Icon name="Shield" size={12} />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Lock" size={12} />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Award" size={12} />
                  <span>ISO 27001</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Version 2.1.0 • Build {Date.now()?.toString()?.slice(-6)}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginAuthentication;

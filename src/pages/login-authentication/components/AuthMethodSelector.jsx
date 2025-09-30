import React from "react";

import Icon from "../../../components/AppIcon";

const AuthMethodSelector = ({ activeMethod, onMethodChange }) => {
  const authMethods = [
    {
      id: "login",
      label: "Username & Password",
      description: "Sign in with your credentials",
      icon: "User",
      primary: true,
    },
    {
      id: "otp",
      label: "Phone OTP",
      description: "Verify with mobile number",
      icon: "Smartphone",
      primary: false,
    },
    {
      id: "abha",
      label: "ABHA Federation",
      description: "Government health account",
      icon: "Shield",
      primary: false,
      badge: "Gov",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="bg-card rounded-lg shadow-clinical border border-border p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Choose Authentication Method
          </h2>
          <p className="text-sm text-muted-foreground">
            Select how you'd like to access your healthcare portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {authMethods?.map((method) => (
            <button
              key={method?.id}
              onClick={() => onMethodChange(method?.id)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                activeMethod === method?.id
                  ? "border-primary bg-primary/5 shadow-clinical"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {method?.badge && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {method?.badge}
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeMethod === method?.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon name={method?.icon} size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium text-sm mb-1 ${
                      activeMethod === method?.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {method?.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {method?.description}
                  </p>
                </div>
              </div>

              {method?.primary && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    Recommended
                  </span>
                </div>
              )}

              {activeMethod === method?.id && (
                <div className="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} color="white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Award" size={12} />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthMethodSelector;

import React from "react";
import Icon from "../../../components/AppIcon";

const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Patient Enrollment Progress
        </h2>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={step?.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-clinical ${
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Icon name="Check" size={16} /> : stepNumber}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                      ? "text-success"
                      : "text-muted-foreground"
                  }`}
                >
                  {step?.title}
                </span>
              </div>
              {index < steps?.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;

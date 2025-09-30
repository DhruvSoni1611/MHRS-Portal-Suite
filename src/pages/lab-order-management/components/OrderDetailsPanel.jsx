import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const OrderDetailsPanel = ({
  order,
  onClose,
  onUploadResults,
  priorityColors,
  statusColors,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [statusHistory, setStatusHistory] = useState([
    {
      status: "ordered",
      timestamp: "2024-09-17 09:30:00",
      user: "Dr. Michael Chen",
      notes: "Order placed through EMR system",
    },
    {
      status: "collected",
      timestamp: "2024-09-18 14:15:00",
      user: "Lab Tech Sarah",
      notes: "Sample collected and labeled properly",
    },
    {
      status: "in-progress",
      timestamp: "2024-09-19 08:00:00",
      user: "Lab Analyst John",
      notes: "Processing initiated, estimated completion 16:00",
    },
  ]);

  const tabs = [
    { id: "details", label: "Order Details", icon: "FileText" },
    { id: "patient", label: "Patient Info", icon: "User" },
    { id: "requirements", label: "Test Requirements", icon: "TestTube" },
    { id: "history", label: "Status History", icon: "Clock" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Order ID
            </label>
            <p className="text-foreground font-medium">{order?.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Ordering Physician
            </label>
            <p className="text-foreground">{order?.orderingPhysician}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Ordering Facility
            </label>
            <p className="text-foreground">{order?.orderingFacility}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Turnaround Time
            </label>
            <p className="text-foreground">{order?.turnaroundTime}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Priority
            </label>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                priorityColors?.[order?.priority]
              }`}
            >
              {order?.priority?.toUpperCase()}
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Current Status
            </label>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                statusColors?.[order?.status]
              }`}
            >
              {order?.status?.replace("-", " ")?.toUpperCase()}
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Collection Date
            </label>
            <p className="text-foreground">
              {formatDate(order?.collectionDate)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Due Date
            </label>
            <p className="text-foreground">{formatDate(order?.dueDate)}</p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Test Types
        </label>
        <div className="mt-2 space-y-2">
          {order?.testTypes?.map((testType, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 bg-muted rounded-md"
            >
              <Icon
                name="TestTube"
                size={16}
                className="text-muted-foreground"
              />
              <span className="text-foreground">{testType}</span>
            </div>
          ))}
        </div>
      </div>

      {order?.preparation && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Patient Preparation
          </label>
          <p className="text-foreground mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            {order?.preparation}
          </p>
        </div>
      )}

      {order?.specialInstructions && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Special Instructions
          </label>
          <p className="text-foreground mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
            {order?.specialInstructions}
          </p>
        </div>
      )}
    </div>
  );

  const renderPatientTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Patient ID
            </label>
            <p className="text-foreground font-medium">{order?.patientId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Full Name
            </label>
            <p className="text-foreground">{order?.patientName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Age
            </label>
            <p className="text-foreground">{order?.patientAge} years</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Gender
            </label>
            <p className="text-foreground">{order?.patientGender}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Contact Information
            </label>
            <p className="text-muted-foreground">
              Available in patient profile
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Insurance
            </label>
            <p className="text-muted-foreground">
              Available in patient profile
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Medical History
            </label>
            <p className="text-muted-foreground">
              Available in patient profile
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-foreground">
            Patient Profile Access
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Access complete patient information including contact details, medical
          history, and previous test results.
        </p>
        <Button
          size="sm"
          variant="outline"
          iconName="ExternalLink"
          iconPosition="left"
        >
          View Full Patient Profile
        </Button>
      </div>
    </div>
  );

  const renderRequirementsTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Test Requirements</h4>
        <div className="space-y-4">
          {order?.testTypes?.map((testType, index) => (
            <div key={index} className="border-l-4 border-primary pl-4">
              <h5 className="font-medium text-foreground mb-2">{testType}</h5>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Sample type: Blood/Serum</p>
                <p>• Volume required: 5ml</p>
                <p>• Storage temperature: 2-8°C</p>
                <p>• Stability: 24 hours at room temperature</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon
            name="AlertTriangle"
            size={16}
            className="text-yellow-600 mt-0.5"
          />
          <div>
            <h4 className="font-medium text-foreground mb-1">
              Quality Control Requirements
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Run quality control samples with each batch</li>
              <li>• Verify instrument calibration before processing</li>
              <li>• Check sample integrity upon receipt</li>
              <li>• Document any deviations from protocol</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon name="Clock" size={16} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">
              Processing Timeline
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sample processing: Within 2 hours of receipt</li>
              <li>• Analysis completion: {order?.turnaroundTime}</li>
              <li>• Result verification: 30 minutes post-analysis</li>
              <li>• Report generation: Immediate upon validation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Status History</h4>
      <div className="space-y-3">
        {statusHistory?.map((entry, index) => (
          <div key={index} className="flex space-x-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full ${
                  statusColors?.[entry?.status]
                    ?.replace("text-", "bg-")
                    ?.replace(" bg-", " ")
                    ?.split(" ")?.[0]
                }`}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground capitalize">
                  {entry?.status?.replace("-", " ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(entry?.timestamp)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">By: {entry?.user}</p>
              {entry?.notes && (
                <p className="text-sm text-foreground mt-1">{entry?.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg border border-border shadow-clinical max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Order Details
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {order?.id} • {order?.patientName}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {order?.status !== "completed" && (
                <Button
                  variant="default"
                  onClick={() => onUploadResults(order)}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Upload Results
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                iconName="X"
              ></Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-border">
          <nav className="flex space-x-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-clinical ${
                  activeTab === tab?.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === "details" && renderDetailsTab()}
          {activeTab === "patient" && renderPatientTab()}
          {activeTab === "requirements" && renderRequirementsTab()}
          {activeTab === "history" && renderHistoryTab()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Last updated: {formatDate(new Date()?.toISOString())}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" iconName="Printer" iconPosition="left">
                Print Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;

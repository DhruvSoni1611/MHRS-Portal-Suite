import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RoleBasedModules = ({ userRole }) => {
  const navigate = useNavigate();

  const moduleConfigs = {
    "clinic-staff": [
      {
        id: "patients",
        title: "Patient Management",
        description: "Search, view, and manage patient records",
        icon: "Users",
        color: "bg-blue-500",
        stats: "1,247 Active Patients",
        actions: [
          {
            label: "Search Patients",
            path: "/patient-search-results",
            icon: "Search",
          },
          {
            label: "New Enrollment",
            path: "/patient-enrollment-workflow",
            icon: "UserPlus",
          },
        ],
      },
      {
        id: "encounters",
        title: "Clinical Encounters",
        description: "Document patient visits and treatments",
        icon: "FileText",
        color: "bg-green-500",
        stats: "23 Pending Today",
        actions: [
          {
            label: "View Encounters",
            path: "/patient-summary-profile",
            icon: "Eye",
          },
          {
            label: "New Encounter",
            path: "/patient-summary-profile",
            icon: "Plus",
          },
        ],
      },
      {
        id: "consent",
        title: "Consent Management",
        description: "Handle patient consent requests",
        icon: "Shield",
        color: "bg-purple-500",
        stats: "5 Pending Approvals",
        actions: [
          {
            label: "Review Requests",
            path: "/patient-summary-profile",
            icon: "CheckCircle",
          },
        ],
      },
    ],
    "pho-official": [
      {
        id: "analytics",
        title: "Health Analytics",
        description: "Population health insights and trends",
        icon: "BarChart3",
        color: "bg-indigo-500",
        stats: "12 Districts Monitored",
        actions: [
          {
            label: "View Dashboard",
            path: "/pho-analytics-dashboard",
            icon: "TrendingUp",
          },
          {
            label: "Generate Report",
            path: "/pho-analytics-dashboard",
            icon: "FileDown",
          },
        ],
      },
      {
        id: "alerts",
        title: "Health Alerts",
        description: "Disease outbreak monitoring",
        icon: "AlertTriangle",
        color: "bg-red-500",
        stats: "3 Active Alerts",
        actions: [
          {
            label: "View Alerts",
            path: "/pho-analytics-dashboard",
            icon: "Bell",
          },
        ],
      },
      {
        id: "surveillance",
        title: "Disease Surveillance",
        description: "Track disease patterns and hotspots",
        icon: "MapPin",
        color: "bg-orange-500",
        stats: "8 Hotspots Identified",
        actions: [
          { label: "View Map", path: "/pho-analytics-dashboard", icon: "Map" },
        ],
      },
    ],
    "lab-personnel": [
      {
        id: "orders",
        title: "Lab Orders",
        description: "Manage laboratory test orders",
        icon: "TestTube",
        color: "bg-cyan-500",
        stats: "45 Pending Orders",
        actions: [
          {
            label: "View Orders",
            path: "/patient-search-results",
            icon: "List",
          },
          {
            label: "Upload Results",
            path: "/patient-summary-profile",
            icon: "Upload",
          },
        ],
      },
      {
        id: "results",
        title: "Test Results",
        description: "Process and upload test results",
        icon: "FileCheck",
        color: "bg-teal-500",
        stats: "12 Results Ready",
        actions: [
          {
            label: "Process Results",
            path: "/patient-summary-profile",
            icon: "CheckSquare",
          },
        ],
      },
      {
        id: "quality",
        title: "Quality Control",
        description: "Monitor lab quality metrics",
        icon: "Award",
        color: "bg-yellow-500",
        stats: "98.5% Accuracy Rate",
        actions: [
          {
            label: "View Metrics",
            path: "/patient-search-results",
            icon: "BarChart",
          },
        ],
      },
    ],
  };

  const modules = moduleConfigs?.[userRole] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Your Modules</h2>
        <div className="text-sm text-muted-foreground capitalize">
          {userRole?.replace("-", " ")} Portal
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules?.map((module) => (
          <div
            key={module.id}
            className="bg-card rounded-lg border border-border p-6 shadow-clinical hover:shadow-clinical-lg transition-clinical"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}
              >
                <Icon name={module.icon} size={24} color="white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {module.stats}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {module.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {module.description}
              </p>
            </div>

            <div className="space-y-2">
              {module.actions?.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(action?.path)}
                  iconName={action?.icon}
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleBasedModules;

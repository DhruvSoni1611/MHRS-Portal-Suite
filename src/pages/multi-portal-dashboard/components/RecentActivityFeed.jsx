import React from "react";
import Icon from "../../../components/AppIcon";

const RecentActivityFeed = ({ userRole }) => {
  const getActivitiesForRole = (role) => {
    const baseActivities = {
      "clinic-staff": [
        {
          id: 1,
          type: "patient_visit",
          title: "Patient Visit Completed",
          description: "Rajesh Kumar - Routine Checkup",
          timestamp: new Date(Date.now() - 300000),
          icon: "UserCheck",
          color: "text-green-600",
        },
        {
          id: 2,
          type: "consent_request",
          title: "Consent Request Approved",
          description: "Priya Sharma - Lab Test Authorization",
          timestamp: new Date(Date.now() - 900000),
          icon: "Shield",
          color: "text-blue-600",
        },
        {
          id: 3,
          type: "enrollment",
          title: "New Patient Enrolled",
          description: "Amit Patel - ABHA ID: 12-3456-7890-1234",
          timestamp: new Date(Date.now() - 1800000),
          icon: "UserPlus",
          color: "text-purple-600",
        },
        {
          id: 4,
          type: "lab_result",
          title: "Lab Results Received",
          description: "Sunita Devi - Blood Test Report",
          timestamp: new Date(Date.now() - 3600000),
          icon: "FileText",
          color: "text-orange-600",
        },
      ],
      "pho-official": [
        {
          id: 1,
          type: "alert",
          title: "Health Alert Generated",
          description: "Dengue outbreak detected in Sector 15",
          timestamp: new Date(Date.now() - 600000),
          icon: "AlertTriangle",
          color: "text-red-600",
        },
        {
          id: 2,
          type: "report",
          title: "Weekly Report Generated",
          description: "District health summary for Week 38",
          timestamp: new Date(Date.now() - 1200000),
          icon: "BarChart3",
          color: "text-indigo-600",
        },
        {
          id: 3,
          type: "surveillance",
          title: "Disease Surveillance Update",
          description: "New hotspot identified in Zone C",
          timestamp: new Date(Date.now() - 2400000),
          icon: "MapPin",
          color: "text-yellow-600",
        },
        {
          id: 4,
          type: "data_sync",
          title: "Data Synchronization Complete",
          description: "All clinic data updated successfully",
          timestamp: new Date(Date.now() - 3600000),
          icon: "RefreshCw",
          color: "text-green-600",
        },
      ],
      "lab-personnel": [
        {
          id: 1,
          type: "test_completed",
          title: "Test Results Uploaded",
          description: "Blood Chemistry Panel - Patient ID: MH001234",
          timestamp: new Date(Date.now() - 450000),
          icon: "Upload",
          color: "text-green-600",
        },
        {
          id: 2,
          type: "order_received",
          title: "New Lab Order Received",
          description: "COVID-19 RT-PCR Test - Urgent Priority",
          timestamp: new Date(Date.now() - 1200000),
          icon: "TestTube",
          color: "text-blue-600",
        },
        {
          id: 3,
          type: "quality_check",
          title: "Quality Control Passed",
          description: "Daily QC for Hematology Analyzer",
          timestamp: new Date(Date.now() - 2700000),
          icon: "CheckCircle",
          color: "text-purple-600",
        },
        {
          id: 4,
          type: "equipment",
          title: "Equipment Maintenance",
          description: "Biochemistry Analyzer - Routine Service",
          timestamp: new Date(Date.now() - 4800000),
          icon: "Settings",
          color: "text-orange-600",
        },
      ],
    };

    return baseActivities?.[role] || [];
  };

  const activities = getActivitiesForRole(userRole);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return timestamp?.toLocaleDateString("en-IN");
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest updates and actions
            </p>
          </div>
        </div>
        <button className="text-sm text-accent hover:text-accent/80 transition-clinical">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div
            key={activity?.id}
            className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-clinical"
          >
            <div
              className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activity?.color}`}
            >
              <Icon name={activity?.icon} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {activity?.title}
                </h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {activity?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Last updated:{" "}
            {new Date()?.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button className="flex items-center space-x-1 text-accent hover:text-accent/80 transition-clinical">
            <Icon name="RefreshCw" size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityFeed;

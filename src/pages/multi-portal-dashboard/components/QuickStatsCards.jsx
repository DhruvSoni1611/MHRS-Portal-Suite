import React from "react";
import Icon from "../../../components/AppIcon";

const QuickStatsCards = ({ userRole }) => {
  const getStatsForRole = (role) => {
    const statsConfig = {
      "clinic-staff": [
        {
          id: "patients_today",
          title: "Patients Today",
          value: "47",
          change: "+12%",
          changeType: "positive",
          icon: "Users",
          color: "bg-blue-500",
          description: "Compared to yesterday",
        },
        {
          id: "pending_consents",
          title: "Pending Consents",
          value: "8",
          change: "-3",
          changeType: "neutral",
          icon: "Shield",
          color: "bg-purple-500",
          description: "Awaiting approval",
        },
        {
          id: "encounters_completed",
          title: "Encounters Completed",
          value: "23",
          change: "+5%",
          changeType: "positive",
          icon: "FileText",
          color: "bg-green-500",
          description: "This week",
        },
        {
          id: "lab_results",
          title: "Lab Results",
          value: "15",
          change: "New",
          changeType: "info",
          icon: "TestTube",
          color: "bg-orange-500",
          description: "Ready for review",
        },
      ],
      "pho-official": [
        {
          id: "active_alerts",
          title: "Active Alerts",
          value: "3",
          change: "+1",
          changeType: "warning",
          icon: "AlertTriangle",
          color: "bg-red-500",
          description: "Require attention",
        },
        {
          id: "districts_monitored",
          title: "Districts Monitored",
          value: "12",
          change: "100%",
          changeType: "positive",
          icon: "MapPin",
          color: "bg-indigo-500",
          description: "Coverage complete",
        },
        {
          id: "disease_hotspots",
          title: "Disease Hotspots",
          value: "8",
          change: "+2",
          changeType: "warning",
          icon: "TrendingUp",
          color: "bg-yellow-500",
          description: "New this week",
        },
        {
          id: "population_health",
          title: "Population Health Score",
          value: "87%",
          change: "+3%",
          changeType: "positive",
          icon: "Heart",
          color: "bg-green-500",
          description: "Overall wellness index",
        },
      ],
      "lab-personnel": [
        {
          id: "pending_orders",
          title: "Pending Orders",
          value: "45",
          change: "+8",
          changeType: "neutral",
          icon: "Clock",
          color: "bg-blue-500",
          description: "In processing queue",
        },
        {
          id: "completed_tests",
          title: "Completed Tests",
          value: "128",
          change: "+15%",
          changeType: "positive",
          icon: "CheckCircle",
          color: "bg-green-500",
          description: "This week",
        },
        {
          id: "quality_score",
          title: "Quality Score",
          value: "98.5%",
          change: "+0.3%",
          changeType: "positive",
          icon: "Award",
          color: "bg-purple-500",
          description: "Accuracy rate",
        },
        {
          id: "turnaround_time",
          title: "Avg. Turnaround",
          value: "4.2h",
          change: "-0.5h",
          changeType: "positive",
          icon: "Timer",
          color: "bg-orange-500",
          description: "Processing time",
        },
      ],
    };

    return statsConfig?.[role] || [];
  };

  const stats = getStatsForRole(userRole);

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case "positive":
        return "TrendingUp";
      case "negative":
        return "TrendingDown";
      case "warning":
        return "AlertCircle";
      case "info":
        return "Info";
      default:
        return "Minus";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card rounded-lg border border-border p-6 shadow-clinical hover:shadow-clinical-lg transition-clinical"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 ${stat?.color} rounded-lg flex items-center justify-center`}
            >
              <Icon name={stat?.icon} size={24} color="white" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm ${getChangeColor(
                stat?.changeType
              )}`}
            >
              <Icon name={getChangeIcon(stat?.changeType)} size={14} />
              <span>{stat?.change}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">
              {stat?.value}
            </div>
            <div className="text-sm font-medium text-foreground">
              {stat?.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat?.description}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <button className="text-xs text-accent hover:text-accent/80 transition-clinical">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;

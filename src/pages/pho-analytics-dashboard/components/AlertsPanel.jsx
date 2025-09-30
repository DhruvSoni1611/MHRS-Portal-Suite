import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const AlertsPanel = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState("all");

  const alerts = [
    {
      id: "alert-001",
      title: "Respiratory Illness Cluster",
      severity: "high",
      affectedPopulation: 1247,
      district: "Central District",
      timestamp: "2025-09-20T08:30:00Z",
      status: "active",
      description: `Unusual increase in respiratory illness cases detected in Central District. Pattern analysis shows 45% increase over baseline in the past 7 days.\n\nRecommended actions:\n- Enhanced surveillance protocols\n- Contact tracing activation\n- Public health advisory issuance`,
      clusters: [
        { area: "Sector 15", cases: 89, population: 12500 },
        { area: "Sector 22", cases: 67, population: 9800 },
        { area: "Sector 31", cases: 54, population: 11200 },
      ],
    },
    {
      id: "alert-002",
      title: "Vaccination Coverage Drop",
      severity: "medium",
      affectedPopulation: 2156,
      district: "North District",
      timestamp: "2025-09-19T14:15:00Z",
      status: "monitoring",
      description: `Vaccination coverage has dropped below 75% threshold in North District. Current coverage at 68.2% for routine immunizations.\n\nContributing factors:\n- Supply chain disruptions\n- Increased vaccine hesitancy\n- Staff shortages at clinics`,
      clusters: [
        { area: "Block A", coverage: "62%", target: "85%" },
        { area: "Block B", coverage: "71%", target: "85%" },
        { area: "Block C", coverage: "73%", target: "85%" },
      ],
    },
    {
      id: "alert-003",
      title: "Water Quality Alert",
      severity: "high",
      affectedPopulation: 856,
      district: "East District",
      timestamp: "2025-09-18T11:45:00Z",
      status: "resolved",
      description: `Water contamination detected in East District affecting multiple neighborhoods. Bacterial contamination levels exceeded safe limits.\n\nActions taken:\n- Water supply temporarily suspended\n- Alternative water sources arranged\n- Disinfection protocols implemented`,
      clusters: [
        { area: "Ward 12", affected: 342, status: "resolved" },
        { area: "Ward 15", affected: 289, status: "resolved" },
        { area: "Ward 18", affected: 225, status: "resolved" },
      ],
    },
    {
      id: "alert-004",
      title: "Seasonal Flu Increase",
      severity: "low",
      affectedPopulation: 445,
      district: "South District",
      timestamp: "2025-09-17T09:20:00Z",
      status: "monitoring",
      description: `Seasonal increase in influenza cases within expected parameters. Monitoring for any unusual patterns or severity.\n\nCurrent status:\n- Cases within seasonal norms\n- No severe complications reported\n- Vaccination campaign ongoing`,
      clusters: [
        { area: "Zone 1", cases: 156, trend: "stable" },
        { area: "Zone 2", cases: 134, trend: "decreasing" },
        { area: "Zone 3", cases: 155, trend: "increasing" },
      ],
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "text-error bg-error/10 border-error/20";
      case "medium":
        return "text-warning bg-warning/10 border-warning/20";
      case "low":
        return "text-success bg-success/10 border-success/20";
      default:
        return "text-muted-foreground bg-muted/10 border-border";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-error bg-error/10";
      case "monitoring":
        return "text-warning bg-warning/10";
      case "resolved":
        return "text-success bg-success/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const filteredAlerts =
    filterSeverity === "all"
      ? alerts
      : alerts?.filter((alert) => alert?.severity === filterSeverity);

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Health Alerts
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-muted transition-clinical">
              <Icon
                name="RefreshCw"
                size={16}
                className="text-muted-foreground"
              />
            </button>
            <button className="p-2 rounded-md hover:bg-muted transition-clinical">
              <Icon
                name="Settings"
                size={16}
                className="text-muted-foreground"
              />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Filter by severity:
          </span>
          {["all", "high", "medium", "low"]?.map((severity) => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-clinical capitalize ${
                filterSeverity === severity
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>
      <div className="flex">
        {/* Alerts List */}
        <div className="flex-1 max-h-96 overflow-y-auto">
          {filteredAlerts?.map((alert) => (
            <div
              key={alert?.id}
              onClick={() => setSelectedAlert(alert)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-clinical ${
                selectedAlert?.id === alert?.id
                  ? "bg-accent/5 border-l-4 border-l-primary"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    {alert?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {alert?.district}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md border ${getSeverityColor(
                      alert?.severity
                    )}`}
                  >
                    {alert?.severity?.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(
                      alert?.status
                    )}`}
                  >
                    {alert?.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Affected: {alert?.affectedPopulation?.toLocaleString()} people
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp)?.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Alert Details Panel */}
        <div className="w-96 border-l border-border p-6">
          {selectedAlert ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-foreground">
                    {selectedAlert?.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md border ${getSeverityColor(
                      selectedAlert?.severity
                    )}`}
                  >
                    {selectedAlert?.severity?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">District</p>
                    <p className="font-medium text-foreground">
                      {selectedAlert?.district}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p
                      className={`font-medium capitalize ${
                        selectedAlert?.status === "active"
                          ? "text-error"
                          : selectedAlert?.status === "monitoring"
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {selectedAlert?.status}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground">
                    Affected Population
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {selectedAlert?.affectedPopulation?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-foreground mb-3">
                  Description & Actions
                </h5>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {selectedAlert?.description}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-foreground mb-3">
                  Affected Areas
                </h5>
                <div className="space-y-2">
                  {selectedAlert?.clusters?.map((cluster, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {cluster?.area}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cluster?.cases
                            ? `${cluster?.cases} cases`
                            : cluster?.coverage
                            ? `Coverage: ${cluster?.coverage}`
                            : cluster?.affected
                            ? `${cluster?.affected} affected`
                            : ""}
                        </p>
                      </div>
                      {cluster?.population && (
                        <span className="text-xs text-muted-foreground">
                          Pop: {cluster?.population?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-clinical">
                  <Icon name="FileText" size={14} />
                  <span>Generate Report</span>
                </button>
                <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-clinical">
                  <Icon
                    name="Share"
                    size={14}
                    className="text-muted-foreground"
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon
                name="AlertTriangle"
                size={32}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">
                Select an alert to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;

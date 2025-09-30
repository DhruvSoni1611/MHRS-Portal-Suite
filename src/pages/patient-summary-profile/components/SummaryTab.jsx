import React from "react";
import Icon from "../../../components/AppIcon";

const SummaryTab = ({ summaryData }) => {
  const { recentVitals, activeMedications, careAlerts, upcomingAppointments } =
    summaryData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Vitals */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
            <Icon name="Activity" size={16} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Recent Vitals
          </h3>
        </div>

        <div className="space-y-4">
          {recentVitals?.map((vital, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={vital?.icon}
                  size={16}
                  className="text-muted-foreground"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {vital?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{vital?.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    vital?.status === "normal"
                      ? "text-success"
                      : vital?.status === "high"
                      ? "text-error"
                      : "text-warning"
                  }`}
                >
                  {vital?.value}
                </p>
                <p className="text-xs text-muted-foreground">{vital?.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Active Medications */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Pill" size={16} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Active Medications
          </h3>
        </div>

        <div className="space-y-3">
          {activeMedications?.map((medication, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">
                  {medication?.name}
                </h4>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {medication?.dosage}
              </p>
              <p className="text-xs text-muted-foreground">
                Prescribed: {medication?.prescribedDate}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Care Alerts */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Care Alerts</h3>
        </div>

        <div className="space-y-3">
          {careAlerts?.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border-l-4 ${
                alert?.priority === "high"
                  ? "bg-error/5 border-error"
                  : alert?.priority === "medium"
                  ? "bg-warning/5 border-warning"
                  : "bg-accent/5 border-accent"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground">
                  {alert?.title}
                </h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    alert?.priority === "high"
                      ? "text-error bg-error/10"
                      : alert?.priority === "medium"
                      ? "text-warning bg-warning/10"
                      : "text-accent bg-accent/10"
                  }`}
                >
                  {alert?.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {alert?.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {alert?.date}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Upcoming Appointments */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
            <Icon name="Calendar" size={16} className="text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Upcoming Appointments
          </h3>
        </div>

        <div className="space-y-3">
          {upcomingAppointments?.map((appointment, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">
                  {appointment?.type}
                </h4>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {appointment?.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  <span>{appointment?.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={12} />
                  <span>{appointment?.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="User" size={12} />
                  <span>{appointment?.doctor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;

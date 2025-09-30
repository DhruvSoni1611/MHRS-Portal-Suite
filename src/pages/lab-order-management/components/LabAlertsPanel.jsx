import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const severityStyles = {
  low: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

const LabAlertsPanel = ({ alerts = [], onAcknowledge, onViewOrder }) => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-clinical">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Lab Alerts</h3>
        <div className="text-sm text-muted-foreground">
          {alerts?.filter((a) => !a?.acknowledged)?.length} unacknowledged
        </div>
      </div>

      {alerts?.length === 0 ? (
        <div className="p-6 text-center">
          <Icon
            name="Bell"
            size={36}
            className="mx-auto text-muted-foreground mb-2"
          />
          <p className="text-sm text-muted-foreground">
            No alerts at the moment
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {alerts?.map((alert) => (
            <div key={alert?.id} className="p-4 flex items-start gap-4">
              <div
                className={`px-2 py-1 text-xs font-medium rounded border ${
                  severityStyles[alert?.severity] || severityStyles.low
                }`}
              >
                {alert?.severity?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {alert?.title}
                  </p>
                  {!alert?.acknowledged && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-primary/10 text-primary">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert?.message}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  Order: {alert?.orderId} • Patient: {alert?.patientName} •{" "}
                  {new Date(alert?.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onViewOrder && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewOrder(alert)}
                    iconName="Eye"
                  >
                    View
                  </Button>
                )}
                {!alert?.acknowledged && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onAcknowledge(alert)}
                    iconName="Check"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabAlertsPanel;

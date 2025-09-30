import React from "react";
import Icon from "../../../components/AppIcon";

const MetricsCard = ({
  title,
  value,
  change,
  changeType,
  icon,
  description,
}) => {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-success";
    if (changeType === "negative") return "text-error";
    return "text-muted-foreground";
  };

  const getChangeIcon = () => {
    if (changeType === "positive") return "TrendingUp";
    if (changeType === "negative") return "TrendingDown";
    return "Minus";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={14} />
          <span className="text-sm font-medium">{change}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default MetricsCard;

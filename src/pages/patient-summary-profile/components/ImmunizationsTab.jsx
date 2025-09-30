import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ImmunizationsTab = ({ immunizationData }) => {
  const [viewMode, setViewMode] = useState("timeline"); // timeline, schedule

  const getVaccineStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-success bg-success/10 border-success/20";
      case "due":
        return "text-warning bg-warning/10 border-warning/20";
      case "overdue":
        return "text-error bg-error/10 border-error/20";
      case "scheduled":
        return "text-accent bg-accent/10 border-accent/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const sortedImmunizations = [...immunizationData]?.sort(
    (a, b) =>
      new Date(b.administeredDate || b.dueDate) -
      new Date(a.administeredDate || a.dueDate)
  );

  const upcomingVaccines = immunizationData?.filter(
    (vaccine) => vaccine?.status === "due" || vaccine?.status === "scheduled"
  );

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Immunization Records
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-clinical ${
                viewMode === "timeline"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode("schedule")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-clinical ${
                viewMode === "schedule"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Schedule View
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-success/5 rounded-lg border border-success/20">
            <p className="text-2xl font-bold text-success">
              {
                immunizationData?.filter((v) => v?.status === "completed")
                  ?.length
              }
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="text-center p-3 bg-warning/5 rounded-lg border border-warning/20">
            <p className="text-2xl font-bold text-warning">
              {immunizationData?.filter((v) => v?.status === "due")?.length}
            </p>
            <p className="text-sm text-muted-foreground">Due</p>
          </div>
          <div className="text-center p-3 bg-error/5 rounded-lg border border-error/20">
            <p className="text-2xl font-bold text-error">
              {immunizationData?.filter((v) => v?.status === "overdue")?.length}
            </p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
          <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent/20">
            <p className="text-2xl font-bold text-accent">
              {
                immunizationData?.filter((v) => v?.status === "scheduled")
                  ?.length
              }
            </p>
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </div>
        </div>
      </div>
      {viewMode === "timeline" && (
        <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
          <h4 className="text-lg font-semibold text-foreground mb-6">
            Vaccination Timeline
          </h4>

          <div className="space-y-6">
            {sortedImmunizations?.map((vaccine, index) => (
              <div key={vaccine?.id} className="relative">
                {/* Timeline Line */}
                {index < sortedImmunizations?.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                )}

                <div className="flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getVaccineStatusColor(
                      vaccine?.status
                    )}`}
                  >
                    <Icon
                      name={
                        vaccine?.status === "completed"
                          ? "Check"
                          : vaccine?.status === "overdue"
                          ? "AlertCircle"
                          : "Clock"
                      }
                      size={20}
                    />
                  </div>

                  {/* Vaccine Details */}
                  <div className="flex-1 bg-muted/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="text-lg font-semibold text-foreground">
                          {vaccine?.vaccineName}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {vaccine?.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getVaccineStatusColor(
                          vaccine?.status
                        )}`}
                      >
                        {vaccine?.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          {vaccine?.status === "completed"
                            ? "Administered:"
                            : "Due Date:"}
                        </span>
                        <p className="font-medium text-foreground">
                          {vaccine?.administeredDate || vaccine?.dueDate}
                        </p>
                      </div>
                      {vaccine?.administeredBy && (
                        <div>
                          <span className="text-muted-foreground">
                            Administered By:
                          </span>
                          <p className="font-medium text-foreground">
                            {vaccine?.administeredBy}
                          </p>
                        </div>
                      )}
                      {vaccine?.batchNumber && (
                        <div>
                          <span className="text-muted-foreground">
                            Batch Number:
                          </span>
                          <p className="font-medium text-foreground font-mono">
                            {vaccine?.batchNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    {vaccine?.nextDueDate && (
                      <div className="mt-3 p-2 bg-accent/10 rounded-md">
                        <p className="text-sm text-accent">
                          <Icon
                            name="Calendar"
                            size={14}
                            className="inline mr-1"
                          />
                          Next dose due: {vaccine?.nextDueDate}
                        </p>
                      </div>
                    )}

                    {vaccine?.notes && (
                      <div className="mt-3 p-2 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          {vaccine?.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {viewMode === "schedule" && (
        <div className="space-y-6">
          {/* Upcoming Vaccinations */}
          {upcomingVaccines?.length > 0 && (
            <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-foreground">
                  Upcoming Vaccinations
                </h4>
                <Button variant="outline" size="sm" iconName="Calendar">
                  Schedule All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingVaccines?.map((vaccine) => (
                  <div
                    key={vaccine?.id}
                    className={`p-4 rounded-lg border ${getVaccineStatusColor(
                      vaccine?.status
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-foreground">
                          {vaccine?.vaccineName}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {vaccine?.description}
                        </p>
                      </div>
                      <Icon
                        name={
                          vaccine?.status === "overdue"
                            ? "AlertCircle"
                            : "Clock"
                        }
                        size={20}
                        className={
                          vaccine?.status === "overdue"
                            ? "text-error"
                            : "text-warning"
                        }
                      />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium text-foreground">
                          {vaccine?.dueDate}
                        </span>
                      </div>
                      {vaccine?.ageRecommendation && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Age Recommendation:
                          </span>
                          <span className="font-medium text-foreground">
                            {vaccine?.ageRecommendation}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Schedule
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Info" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vaccination Schedule by Age */}
          <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Recommended Vaccination Schedule
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Vaccine
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Age/Schedule
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Last Given
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Next Due
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {immunizationData?.map((vaccine) => (
                    <tr
                      key={vaccine?.id}
                      className="border-b border-border hover:bg-muted/50 transition-clinical"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {vaccine?.vaccineName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vaccine?.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {vaccine?.ageRecommendation}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getVaccineStatusColor(
                            vaccine?.status
                          )}`}
                        >
                          {vaccine?.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {vaccine?.administeredDate || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {vaccine?.nextDueDate || vaccine?.dueDate || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {vaccine?.status !== "completed" && (
                          <Button variant="outline" size="sm">
                            Schedule
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImmunizationsTab;

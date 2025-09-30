import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const EncountersTab = ({ encountersData }) => {
  const [expandedEncounter, setExpandedEncounter] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const encounterTypes = [
    { id: "all", name: "All Encounters", count: encountersData?.length },
    {
      id: "consultation",
      name: "Consultations",
      count: encountersData?.filter((e) => e?.type === "consultation")?.length,
    },
    {
      id: "follow_up",
      name: "Follow-ups",
      count: encountersData?.filter((e) => e?.type === "follow_up")?.length,
    },
    {
      id: "emergency",
      name: "Emergency",
      count: encountersData?.filter((e) => e?.type === "emergency")?.length,
    },
    {
      id: "procedure",
      name: "Procedures",
      count: encountersData?.filter((e) => e?.type === "procedure")?.length,
    },
  ];

  const filteredEncounters =
    filterType === "all"
      ? encountersData
      : encountersData?.filter((encounter) => encounter?.type === filterType);

  const toggleExpanded = (encounterId) => {
    setExpandedEncounter(
      expandedEncounter === encounterId ? null : encounterId
    );
  };

  const getEncounterTypeColor = (type) => {
    switch (type) {
      case "consultation":
        return "text-primary bg-primary/10";
      case "follow_up":
        return "text-accent bg-accent/10";
      case "emergency":
        return "text-error bg-error/10";
      case "procedure":
        return "text-secondary bg-secondary/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getEncounterIcon = (type) => {
    switch (type) {
      case "consultation":
        return "Stethoscope";
      case "follow_up":
        return "RotateCcw";
      case "emergency":
        return "AlertCircle";
      case "procedure":
        return "Activity";
      default:
        return "FileText";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Filter Encounters
        </h3>
        <div className="flex flex-wrap gap-2">
          {encounterTypes?.map((type) => (
            <button
              key={type?.id}
              onClick={() => setFilterType(type?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-clinical ${
                filterType === type?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {type?.name}
              <span className="ml-2 text-xs opacity-75">({type?.count})</span>
            </button>
          ))}
        </div>
      </div>
      {/* Encounters List */}
      <div className="space-y-4">
        {filteredEncounters?.map((encounter) => (
          <div
            key={encounter?.id}
            className="bg-card border border-border rounded-lg shadow-clinical"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getEncounterTypeColor(
                      encounter?.type
                    )}`}
                  >
                    <Icon name={getEncounterIcon(encounter?.type)} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {encounter?.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEncounterTypeColor(
                          encounter?.type
                        )}`}
                      >
                        {encounter?.type?.replace("_", " ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon
                          name="Calendar"
                          size={14}
                          className="text-muted-foreground"
                        />
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium text-foreground">
                          {encounter?.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name="User"
                          size={14}
                          className="text-muted-foreground"
                        />
                        <span className="text-muted-foreground">Provider:</span>
                        <span className="font-medium text-foreground">
                          {encounter?.provider}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name="MapPin"
                          size={14}
                          className="text-muted-foreground"
                        />
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium text-foreground">
                          {encounter?.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    onClick={() =>
                      console.log("Download encounter", encounter?.id)
                    }
                  >
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={
                      expandedEncounter === encounter?.id
                        ? "ChevronUp"
                        : "ChevronDown"
                    }
                    onClick={() => toggleExpanded(encounter?.id)}
                  >
                    {expandedEncounter === encounter?.id ? "Hide" : "Show"}{" "}
                    Details
                  </Button>
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Chief Complaint:
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {encounter?.chiefComplaint}
                </p>
              </div>

              {/* Expanded Details */}
              {expandedEncounter === encounter?.id && (
                <div className="border-t border-border pt-4 space-y-4">
                  {/* Vital Signs */}
                  {encounter?.vitals && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Vital Signs
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(encounter?.vitals)?.map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="bg-muted/30 p-3 rounded-md"
                            >
                              <p className="text-xs text-muted-foreground capitalize">
                                {key?.replace(/([A-Z])/g, " $1")}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {value}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assessment & Plan */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {encounter?.assessment && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">
                          Assessment
                        </h4>
                        <div className="space-y-2">
                          {encounter?.assessment?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-2 bg-muted/30 rounded-md"
                            >
                              <span className="text-xs text-muted-foreground font-mono mt-1">
                                {item?.icdCode}
                              </span>
                              <span className="text-sm text-foreground">
                                {item?.diagnosis}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {encounter?.plan && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">
                          Treatment Plan
                        </h4>
                        <div className="space-y-2">
                          {encounter?.plan?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-2 bg-muted/30 rounded-md"
                            >
                              <Icon
                                name="ArrowRight"
                                size={14}
                                className="text-muted-foreground mt-0.5"
                              />
                              <span className="text-sm text-foreground">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Medications */}
                  {encounter?.medications &&
                    encounter?.medications?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">
                          Medications Prescribed
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {encounter?.medications?.map((med, index) => (
                            <div
                              key={index}
                              className="p-3 bg-muted/30 rounded-md"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <h5 className="text-sm font-medium text-foreground">
                                  {med?.name}
                                </h5>
                                <span className="text-xs text-muted-foreground">
                                  {med?.duration}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {med?.dosage}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {med?.instructions}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Lab Orders */}
                  {encounter?.labOrders && encounter?.labOrders?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Lab Orders
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {encounter?.labOrders?.map((lab, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full"
                          >
                            {lab}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up */}
                  {encounter?.followUp && (
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          name="Calendar"
                          size={16}
                          className="text-primary"
                        />
                        <h4 className="text-sm font-semibold text-primary">
                          Follow-up Required
                        </h4>
                      </div>
                      <p className="text-sm text-foreground">
                        {encounter?.followUp}
                      </p>
                    </div>
                  )}

                  {/* Provider Notes */}
                  {encounter?.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Provider Notes
                      </h4>
                      <div className="p-3 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {encounter?.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredEncounters?.length === 0 && (
        <div className="bg-card border border-border rounded-lg shadow-clinical p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Encounters Found
          </h3>
          <p className="text-muted-foreground">
            No encounters found for the selected filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default EncountersTab;

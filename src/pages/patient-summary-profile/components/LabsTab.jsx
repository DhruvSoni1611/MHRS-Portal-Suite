import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const LabsTab = ({ labData }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedResults, setExpandedResults] = useState({});

  const categories = [
    { id: "all", name: "All Tests", count: labData?.length },
    {
      id: "blood",
      name: "Blood Tests",
      count: labData?.filter((lab) => lab?.category === "blood")?.length,
    },
    {
      id: "urine",
      name: "Urine Tests",
      count: labData?.filter((lab) => lab?.category === "urine")?.length,
    },
    {
      id: "imaging",
      name: "Imaging",
      count: labData?.filter((lab) => lab?.category === "imaging")?.length,
    },
    {
      id: "microbiology",
      name: "Microbiology",
      count: labData?.filter((lab) => lab?.category === "microbiology")?.length,
    },
  ];

  const filteredLabs =
    selectedCategory === "all"
      ? labData
      : labData?.filter((lab) => lab?.category === selectedCategory);

  const toggleExpanded = (labId) => {
    setExpandedResults((prev) => ({
      ...prev,
      [labId]: !prev?.[labId],
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-success bg-success/10";
      case "pending":
        return "text-warning bg-warning/10";
      case "in_progress":
        return "text-accent bg-accent/10";
      case "cancelled":
        return "text-error bg-error/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getResultStatus = (value, normalRange) => {
    if (!normalRange || !value) return "normal";
    const numValue = parseFloat(value);
    const [min, max] = normalRange?.split("-")?.map((v) => parseFloat(v));
    if (numValue < min) return "low";
    if (numValue > max) return "high";
    return "normal";
  };

  const getResultStatusColor = (status) => {
    switch (status) {
      case "high":
        return "text-error";
      case "low":
        return "text-warning";
      case "normal":
        return "text-success";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setSelectedCategory(category?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-clinical ${
                selectedCategory === category?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category?.name}
              <span className="ml-2 text-xs opacity-75">
                ({category?.count})
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Lab Results */}
      <div className="space-y-4">
        {filteredLabs?.map((lab) => (
          <div
            key={lab?.id}
            className="bg-card border border-border rounded-lg shadow-clinical"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {lab?.testName}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        lab?.status
                      )}`}
                    >
                      {lab?.status?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Test Date:</span>
                      <p className="font-medium text-foreground">
                        {lab?.testDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lab:</span>
                      <p className="font-medium text-foreground">
                        {lab?.laboratory}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ordered By:</span>
                      <p className="font-medium text-foreground">
                        {lab?.orderedBy}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lab?.reportUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      onClick={() => window.open(lab?.reportUrl, "_blank")}
                    >
                      Download
                    </Button>
                  )}
                  {lab?.results && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={
                        expandedResults?.[lab?.id] ? "ChevronUp" : "ChevronDown"
                      }
                      onClick={() => toggleExpanded(lab?.id)}
                    >
                      {expandedResults?.[lab?.id] ? "Hide" : "Show"} Results
                    </Button>
                  )}
                </div>
              </div>

              {/* Test Results */}
              {expandedResults?.[lab?.id] && lab?.results && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-md font-semibold text-foreground mb-3">
                    Test Results
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                            Parameter
                          </th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                            Value
                          </th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                            Normal Range
                          </th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                            Unit
                          </th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {lab?.results?.map((result, index) => {
                          const status = getResultStatus(
                            result?.value,
                            result?.normalRange
                          );
                          return (
                            <tr
                              key={index}
                              className="border-b border-border hover:bg-muted/50 transition-clinical"
                            >
                              <td className="py-2 px-3 text-sm font-medium text-foreground">
                                {result?.parameter}
                              </td>
                              <td
                                className={`py-2 px-3 text-sm font-semibold ${getResultStatusColor(
                                  status
                                )}`}
                              >
                                {result?.value}
                              </td>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {result?.normalRange}
                              </td>
                              <td className="py-2 px-3 text-sm text-muted-foreground">
                                {result?.unit}
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    status === "normal"
                                      ? "text-success bg-success/10"
                                      : status === "high"
                                      ? "text-error bg-error/10"
                                      : status === "low"
                                      ? "text-warning bg-warning/10"
                                      : "text-muted-foreground bg-muted"
                                  }`}
                                >
                                  {status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {lab?.notes && (
                <div className="mt-4 p-3 bg-muted/50 rounded-md">
                  <h5 className="text-sm font-medium text-foreground mb-1">
                    Notes:
                  </h5>
                  <p className="text-sm text-muted-foreground">{lab?.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredLabs?.length === 0 && (
        <div className="bg-card border border-border rounded-lg shadow-clinical p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Lab Results
          </h3>
          <p className="text-muted-foreground">
            No lab results found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
};

export default LabsTab;

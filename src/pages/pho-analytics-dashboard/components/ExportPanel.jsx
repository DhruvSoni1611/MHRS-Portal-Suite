import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const ExportPanel = () => {
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportType, setExportType] = useState("summary");
  const [dateRange, setDateRange] = useState("30days");
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: "pdf", label: "PDF Report" },
    { value: "excel", label: "Excel Spreadsheet" },
    { value: "csv", label: "CSV Data" },
    { value: "json", label: "JSON Data" },
  ];

  const typeOptions = [
    { value: "summary", label: "Executive Summary" },
    { value: "detailed", label: "Detailed Analytics" },
    { value: "trends", label: "Trend Analysis" },
    { value: "alerts", label: "Alert History" },
    { value: "demographics", label: "Demographics Report" },
  ];

  const rangeOptions = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "custom", label: "Custom Range" },
  ];

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock download
    const filename = `pho-analytics-${exportType}-${dateRange}.${exportFormat}`;
    console.log(`Exporting: ${filename}`);

    setIsExporting(false);
  };

  const quickExports = [
    {
      title: "Daily Summary",
      description: "Key metrics and alerts from today",
      format: "PDF",
      icon: "FileText",
    },
    {
      title: "Weekly Trends",
      description: "Disease trends and patterns",
      format: "Excel",
      icon: "TrendingUp",
    },
    {
      title: "Alert Report",
      description: "Active and resolved health alerts",
      format: "PDF",
      icon: "AlertTriangle",
    },
    {
      title: "Raw Data Export",
      description: "Complete dataset for analysis",
      format: "CSV",
      icon: "Database",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Export & Reports
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate reports for stakeholders and authorities
          </p>
        </div>
        <Icon name="Download" size={20} className="text-primary" />
      </div>
      {/* Quick Export Options */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Quick Exports
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickExports?.map((item, index) => (
            <button
              key={index}
              onClick={handleExport}
              className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-clinical text-left"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={item?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item?.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item?.description}
                </p>
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                {item?.format}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Custom Export */}
      <div className="border-t border-border pt-6">
        <h4 className="text-sm font-medium text-foreground mb-4">
          Custom Export
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />

          <Select
            label="Report Type"
            options={typeOptions}
            value={exportType}
            onChange={setExportType}
          />

          <Select
            label="Date Range"
            options={rangeOptions}
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        {/* Export Preview */}
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {typeOptions?.find((t) => t?.value === exportType)?.label} -{" "}
              {formatOptions?.find((f) => f?.value === exportFormat)?.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Data range:{" "}
            {rangeOptions?.find((r) => r?.value === dateRange)?.label} •
            Generated on {new Date()?.toLocaleDateString("en-IN")} • Estimated
            size: ~2.5 MB
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Shield" size={14} />
            <span>
              All exported data is de-identified and complies with privacy
              regulations
            </span>
          </div>

          <Button
            variant="default"
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
          >
            {isExporting ? "Generating..." : "Export Report"}
          </Button>
        </div>
      </div>
      {/* Recent Exports */}
      <div className="border-t border-border pt-6 mt-6">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Recent Exports
        </h4>
        <div className="space-y-2">
          {[
            {
              name: "Weekly Summary Report",
              date: "2025-09-19",
              format: "PDF",
              size: "1.2 MB",
            },
            {
              name: "Disease Trends Analysis",
              date: "2025-09-18",
              format: "Excel",
              size: "3.4 MB",
            },
            {
              name: "Alert History Export",
              date: "2025-09-17",
              format: "CSV",
              size: "856 KB",
            },
          ]?.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-clinical"
            >
              <div className="flex items-center space-x-3">
                <Icon
                  name="FileText"
                  size={14}
                  className="text-muted-foreground"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {file?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file?.date} • {file?.format} • {file?.size}
                  </p>
                </div>
              </div>
              <button className="p-1 rounded-md hover:bg-muted transition-clinical">
                <Icon
                  name="Download"
                  size={14}
                  className="text-muted-foreground"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;

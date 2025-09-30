import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const FilterPanel = ({ filters, onFilterChange, labOrders }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [savedFilters, setSavedFilters] = useState([
    {
      name: "Urgent Orders",
      filters: {
        status: "all",
        priority: "urgent",
        testType: "all",
        dateRange: "today",
      },
    },
    {
      name: "Overdue Items",
      filters: {
        status: "overdue",
        priority: "all",
        testType: "all",
        dateRange: "all",
      },
    },
    {
      name: "Completed Today",
      filters: {
        status: "completed",
        priority: "all",
        testType: "all",
        dateRange: "today",
      },
    },
  ]);

  // Extract unique values from orders for filter options
  const uniqueStatuses = [...new Set(labOrders?.map((order) => order?.status))];
  const uniquePriorities = [
    ...new Set(labOrders?.map((order) => order?.priority)),
  ];
  const uniqueFacilities = [
    ...new Set(labOrders?.map((order) => order?.orderingFacility)),
  ];
  const uniqueTestTypes = [
    ...new Set(labOrders?.flatMap((order) => order?.testTypes)),
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    ...uniqueStatuses?.map((status) => ({
      value: status,
      label: status
        ?.replace("-", " ")
        ?.replace(/\b\w/g, (l) => l?.toUpperCase()),
    })),
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    ...uniquePriorities?.map((priority) => ({
      value: priority,
      label: priority?.toUpperCase(),
    })),
  ];

  const facilityOptions = [
    { value: "all", label: "All Facilities" },
    ...uniqueFacilities?.map((facility) => ({
      value: facility,
      label: facility,
    })),
  ];

  const testTypeOptions = [
    { value: "all", label: "All Test Types" },
    ...uniqueTestTypes?.map((testType) => ({
      value: testType,
      label: testType,
    })),
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleSavedFilterApply = (savedFilter) => {
    onFilterChange(savedFilter?.filters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: "all",
      priority: "all",
      testType: "all",
      dateRange: "all",
      facility: "all",
    };
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(
    (value) => value !== "all"
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-clinical overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center">
            <Icon name="Filter" size={16} className="mr-2" />
            Advanced Filters
          </h3>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            iconName={isCollapsed ? "ChevronDown" : "ChevronUp"}
          ></Button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Saved Filter Presets */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Quick Filters
            </label>
            <div className="space-y-2">
              {savedFilters?.map((savedFilter, index) => (
                <button
                  key={index}
                  onClick={() => handleSavedFilterApply(savedFilter)}
                  className="w-full text-left px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-clinical"
                >
                  {savedFilter?.name}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Status
            </label>
            <Select
              value={filters?.status}
              onValueChange={(value) => handleFilterChange("status", value)}
              options={statusOptions}
            />
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Priority
            </label>
            <Select
              value={filters?.priority}
              onValueChange={(value) => handleFilterChange("priority", value)}
              options={priorityOptions}
            />
          </div>

          {/* Test Type Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Test Type
            </label>
            <Select
              value={filters?.testType}
              onValueChange={(value) => handleFilterChange("testType", value)}
              options={testTypeOptions}
            />
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Date Range
            </label>
            <Select
              value={filters?.dateRange}
              onValueChange={(value) => handleFilterChange("dateRange", value)}
              options={dateRangeOptions}
            />
          </div>

          {/* Facility Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Ordering Facility
            </label>
            <Select
              value={filters?.facility}
              onValueChange={(value) => handleFilterChange("facility", value)}
              options={facilityOptions}
            />
          </div>

          {/* Filter Actions */}
          <div className="pt-4 border-t border-border space-y-2">
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="outline"
                onClick={clearAllFilters}
                iconName="X"
                iconPosition="left"
                fullWidth
              >
                Clear All Filters
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              iconName="Save"
              iconPosition="left"
              fullWidth
            >
              Save Current Filters
            </Button>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Active Filters:
              </p>
              <div className="space-y-1">
                {Object.entries(filters)?.map(
                  ([key, value]) =>
                    value !== "all" && (
                      <div
                        key={key}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground capitalize">
                          {key}:
                        </span>
                        <span className="text-foreground font-medium">
                          {value}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

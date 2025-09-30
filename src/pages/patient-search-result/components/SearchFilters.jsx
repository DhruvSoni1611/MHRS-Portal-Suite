import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  onQRScan,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const genderOptions = [
    { value: "", label: "All Genders" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const ageRangeOptions = [
    { value: "", label: "All Ages" },
    { value: "0-18", label: "0-18 years" },
    { value: "19-35", label: "19-35 years" },
    { value: "36-50", label: "36-50 years" },
    { value: "51-65", label: "51-65 years" },
    { value: "65+", label: "65+ years" },
  ];

  const registrationPeriodOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Search by name, phone, ABHA ID, or patient token..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onQRScan}
            iconName="QrCode"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            Scan QR
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Filters
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select
              label="Gender"
              options={genderOptions}
              value={filters?.gender || ""}
              onChange={(value) => handleFilterChange("gender", value)}
              placeholder="Select gender"
            />

            <Select
              label="Age Range"
              options={ageRangeOptions}
              value={filters?.ageRange || ""}
              onChange={(value) => handleFilterChange("ageRange", value)}
              placeholder="Select age range"
            />

            <Select
              label="Registration Period"
              options={registrationPeriodOptions}
              value={filters?.registrationPeriod || ""}
              onChange={(value) =>
                handleFilterChange("registrationPeriod", value)
              }
              placeholder="Select period"
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="Users" size={16} />
          <span>
            {resultCount > 0 ? (
              <>
                Found{" "}
                <span className="font-medium text-foreground">
                  {resultCount}
                </span>{" "}
                patients
              </>
            ) : (
              "No patients found"
            )}
          </span>
        </div>

        {(searchQuery || Object.values(filters)?.some((v) => v)) && (
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={16} />
            <span>Filters active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;

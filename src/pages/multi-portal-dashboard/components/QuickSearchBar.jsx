import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const QuickSearchBar = ({ userRole }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("phone");
  const navigate = useNavigate();

  const searchTypes = [
    { value: "phone", label: "Phone Number", icon: "Phone" },
    { value: "token", label: "Patient Token", icon: "Hash" },
    { value: "abha", label: "ABHA ID", icon: "CreditCard" },
    { value: "name", label: "Patient Name", icon: "User" },
  ];

  const handleSearch = () => {
    if (searchQuery?.trim()) {
      navigate("/patient-search-results", {
        state: { query: searchQuery, type: searchType },
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-clinical">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Search" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Quick Patient Search
          </h3>
          <p className="text-sm text-muted-foreground">
            Find patients across the system
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {/* Search Type Selector */}
        <div className="flex flex-wrap gap-2">
          {searchTypes?.map((type) => (
            <button
              key={type?.value}
              onClick={() => setSearchType(type?.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-clinical ${
                searchType === type?.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              <Icon name={type?.icon} size={16} />
              <span>{type?.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={`Enter ${searchTypes
                ?.find((t) => t?.value === searchType)
                ?.label?.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
          </div>
          <Button
            variant="default"
            onClick={handleSearch}
            disabled={!searchQuery?.trim()}
            iconName="Search"
            iconPosition="left"
          >
            Search
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <button
            onClick={() => navigate("/patient-search-results")}
            className="text-sm text-accent hover:text-accent/80 transition-clinical"
          >
            Advanced Search
          </button>
          {userRole === "clinic-staff" && (
            <button
              onClick={() => navigate("/patient-enrollment-workflow")}
              className="text-sm text-accent hover:text-accent/80 transition-clinical"
            >
              New Patient Enrollment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSearchBar;

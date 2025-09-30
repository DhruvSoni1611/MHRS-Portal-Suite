import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const InteractiveMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [mapOverlay, setMapOverlay] = useState("cases");

  const districtData = [
    {
      id: "district-1",
      name: "Central District",
      cases: 245,
      severity: "high",
      lat: 28.6139,
      lng: 77.209,
    },
    {
      id: "district-2",
      name: "North District",
      cases: 156,
      severity: "medium",
      lat: 28.7041,
      lng: 77.1025,
    },
    {
      id: "district-3",
      name: "South District",
      cases: 89,
      severity: "low",
      lat: 28.5355,
      lng: 77.391,
    },
    {
      id: "district-4",
      name: "East District",
      cases: 198,
      severity: "high",
      lat: 28.6508,
      lng: 77.2311,
    },
    {
      id: "district-5",
      name: "West District",
      cases: 134,
      severity: "medium",
      lat: 28.6692,
      lng: 77.135,
    },
  ];

  const overlayOptions = [
    { value: "cases", label: "Active Cases", icon: "Activity" },
    { value: "vaccination", label: "Vaccination Rate", icon: "Shield" },
    { value: "mortality", label: "Mortality Rate", icon: "AlertTriangle" },
    { value: "recovery", label: "Recovery Rate", icon: "TrendingUp" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-error";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-success";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Disease Hotspot Map
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-muted transition-clinical">
              <Icon
                name="Maximize2"
                size={16}
                className="text-muted-foreground"
              />
            </button>
            <button className="p-2 rounded-md hover:bg-muted transition-clinical">
              <Icon
                name="Download"
                size={16}
                className="text-muted-foreground"
              />
            </button>
          </div>
        </div>

        {/* Map Overlay Controls */}
        <div className="flex flex-wrap gap-2">
          {overlayOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setMapOverlay(option?.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-clinical ${
                mapOverlay === option?.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              <Icon name={option?.icon} size={14} />
              <span>{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="h-96 bg-muted/20 rounded-lg m-6 overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Health District Map"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=28.6139,77.2090&z=10&output=embed"
              className="rounded-lg"
            />

            {/* District Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {districtData?.map((district, index) => (
                <div
                  key={district?.id}
                  className={`absolute w-4 h-4 rounded-full ${getSeverityColor(
                    district?.severity
                  )} pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse-gentle`}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                  }}
                  onClick={() => setSelectedDistrict(district)}
                  title={`${district?.name}: ${district?.cases} cases`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-8 bg-card border border-border rounded-lg p-4 shadow-clinical">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Severity Levels
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  High (&gt;200 cases)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  Medium (100-200 cases)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  Low (&lt;100 cases)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* District Details Panel */}
        <div className="w-80 border-l border-border p-6">
          <h4 className="text-sm font-medium text-foreground mb-4">
            District Information
          </h4>

          {selectedDistrict ? (
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-foreground">
                  {selectedDistrict?.name}
                </h5>
                <p className="text-sm text-muted-foreground">
                  Selected District
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Active Cases</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedDistrict?.cases}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <p
                    className={`text-lg font-semibold capitalize ${
                      selectedDistrict?.severity === "high"
                        ? "text-error"
                        : selectedDistrict?.severity === "medium"
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {selectedDistrict?.severity}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Population Coverage
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    85,432
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Vaccination Rate
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    78.5%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Recovery Rate
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    92.1%
                  </span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-clinical">
                <Icon name="ExternalLink" size={14} />
                <span>View Detailed Report</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon
                name="MapPin"
                size={32}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">
                Click on a district marker to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import MetricsCard from "./components/MetricsCard";
import TrendChart from "./components/TrendChart";
import DemographicsChart from "./components/DemographicsChart";
import InteractiveMap from "./components/InteractiveMap";
import AlertsPanel from "./components/AlertsPanel";
import ExportPanel from "./components/ExportPanel";

const PHOAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for metrics cards
  const metricsData = [
    {
      title: "Total Population Covered",
      value: "2.4M",
      change: "+2.3%",
      changeType: "positive",
      icon: "Users",
      description: "vs last month",
    },
    {
      title: "Active Health Cases",
      value: "1,247",
      change: "-8.5%",
      changeType: "positive",
      icon: "Activity",
      description: "vs last week",
    },
    {
      title: "Vaccination Coverage",
      value: "78.5%",
      change: "+1.2%",
      changeType: "positive",
      icon: "Shield",
      description: "target: 85%",
    },
    {
      title: "Active Alerts",
      value: "12",
      change: "+3",
      changeType: "negative",
      icon: "AlertTriangle",
      description: "requires attention",
    },
  ];

  // Mock data for trend charts
  const diseaseIncidenceData = [
    {
      date: "2025-09-01",
      respiratory: 145,
      gastrointestinal: 89,
      vector_borne: 34,
      other: 67,
    },
    {
      date: "2025-09-05",
      respiratory: 167,
      gastrointestinal: 92,
      vector_borne: 28,
      other: 71,
    },
    {
      date: "2025-09-10",
      respiratory: 189,
      gastrointestinal: 78,
      vector_borne: 45,
      other: 63,
    },
    {
      date: "2025-09-15",
      respiratory: 234,
      gastrointestinal: 85,
      vector_borne: 52,
      other: 58,
    },
    {
      date: "2025-09-20",
      respiratory: 198,
      gastrointestinal: 91,
      vector_borne: 38,
      other: 72,
    },
  ];

  const vaccinationTrendData = [
    { date: "2025-09-01", routine: 76.2, covid: 89.5, seasonal: 45.8 },
    { date: "2025-09-05", routine: 77.1, covid: 88.9, seasonal: 48.2 },
    { date: "2025-09-10", routine: 78.3, covid: 87.6, seasonal: 52.1 },
    { date: "2025-09-15", routine: 79.1, covid: 86.8, seasonal: 55.7 },
    { date: "2025-09-20", routine: 78.5, covid: 85.9, seasonal: 58.3 },
  ];

  // Mock data for demographics
  const ageGroupData = [
    { name: "0-5 years", value: 245 },
    { name: "6-17 years", value: 189 },
    { name: "18-64 years", value: 567 },
    { name: "65+ years", value: 123 },
  ];

  const genderDistribution = [
    { name: "Male", value: 52.3 },
    { name: "Female", value: 47.7 },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    // In real app, this would trigger data refetch
  };

  const timeRangeOptions = [
    { value: "7days", label: "7 Days" },
    { value: "30days", label: "30 Days" },
    { value: "90days", label: "90 Days" },
    { value: "1year", label: "1 Year" },
  ];

  useEffect(() => {
    // Auto-refresh data every 5 minutes
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="pho-official"
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole="pho-official"
      />
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-60"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Public Health Analytics
              </h1>
              <p className="text-muted-foreground">
                Comprehensive health data visualization and monitoring dashboard
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Time Range:
                </span>
                <div className="flex bg-muted rounded-lg p-1">
                  {timeRangeOptions?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => handleTimeRangeChange(option?.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-clinical ${
                        selectedTimeRange === option?.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option?.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                loading={refreshing}
                iconName="RefreshCw"
                iconPosition="left"
                onClick={handleRefresh}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>

              {/* Quick Actions */}
              <Button
                variant="default"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                onClick={() => navigate("/patient-search-results")}
              >
                Generate Report
              </Button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse-gentle"></div>
              <span className="text-sm font-medium text-foreground">
                System Status: Online
              </span>
              <span className="text-xs text-muted-foreground">
                Last updated: {new Date()?.toLocaleTimeString("en-IN")}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Data Sources: 5 Active</span>
              <span>•</span>
              <span>Coverage: 2.4M Population</span>
              <span>•</span>
              <span>Sync Status: Real-time</span>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart
              title="Disease Incidence Trends"
              data={diseaseIncidenceData}
              lines={[
                { key: "respiratory", name: "Respiratory" },
                { key: "gastrointestinal", name: "Gastrointestinal" },
                { key: "vector_borne", name: "Vector-borne" },
                { key: "other", name: "Other" },
              ]}
              height={350}
            />

            <TrendChart
              title="Vaccination Coverage Trends"
              data={vaccinationTrendData}
              lines={[
                { key: "routine", name: "Routine Immunization" },
                { key: "covid", name: "COVID-19" },
                { key: "seasonal", name: "Seasonal Flu" },
              ]}
              height={350}
            />
          </div>

          {/* Demographics and Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DemographicsChart
              title="Cases by Age Group"
              data={ageGroupData}
              type="bar"
            />

            <DemographicsChart
              title="Gender Distribution"
              data={genderDistribution}
              type="pie"
            />

            <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Search"
                  iconPosition="left"
                  onClick={() => navigate("/patient-search-results")}
                >
                  Search Patient Records
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Users"
                  iconPosition="left"
                  onClick={() => navigate("/patient-enrollment-workflow")}
                >
                  Patient Enrollment
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  iconName="BarChart3"
                  iconPosition="left"
                  onClick={() => navigate("/multi-portal-dashboard")}
                >
                  Multi-Portal Dashboard
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  iconName="FileText"
                  iconPosition="left"
                  onClick={() => navigate("/patient-summary-profile")}
                >
                  Patient Profiles
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <InteractiveMap />

          {/* Alerts and Export Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsPanel />
            <ExportPanel />
          </div>

          {/* Footer Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  MHRS Portal Suite - PHO Analytics
                </h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive public health monitoring and analytics platform
                </p>
              </div>

              <div className="text-right text-sm text-muted-foreground">
                <p>
                  © {new Date()?.getFullYear()} Ministry of Health & Family
                  Welfare
                </p>
                <p>Government of India</p>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                <span>Data Privacy Compliant</span>
                <span>•</span>
                <span>HIPAA Certified</span>
                <span>•</span>
                <span>ISO 27001 Compliant</span>
                <span>•</span>
                <span>Real-time Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PHOAnalyticsDashboard;

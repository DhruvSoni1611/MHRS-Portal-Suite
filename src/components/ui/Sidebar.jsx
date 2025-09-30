import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth.jsx";
import Icon from "../AppIcon";

const Sidebar = ({
  isCollapsed = false,
  onToggle,
  userRole = "clinic-staff",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role: authRole, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState([
    "dashboard",
    "patients",
  ]);

  const navigationSections = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      roles: ["clinic-staff", "pho-official", "lab-personnel"],
      items: [
        {
          label: "Overview",
          path: "/multi-portal-dashboard",
          icon: "Home",
          roles: ["clinic-staff", "pho-official", "lab-personnel"],
        },
      ],
    },
    {
      id: "patients",
      label: "Patient Management",
      icon: "Users",
      roles: ["clinic-staff", "lab-personnel"],
      items: [
        {
          label: "Search Patients",
          path: "/patient-search-results",
          icon: "Search",
          roles: ["clinic-staff", "lab-personnel"],
        },
        {
          label: "Patient Profile",
          path: "/patient-summary-profile",
          icon: "User",
          roles: ["clinic-staff", "lab-personnel"],
        },
        {
          label: "New Enrollment",
          path: "/patient-enrollment-workflow",
          icon: "UserPlus",
          roles: ["clinic-staff"],
        },
      ],
    },
    {
      id: "analytics",
      label: "Public Health Analytics",
      icon: "BarChart3",
      roles: ["pho-official"],
      items: [
        {
          label: "PHO Dashboard",
          path: "/pho-analytics-dashboard",
          icon: "TrendingUp",
          roles: ["pho-official"],
        },
      ],
    },
    {
      id: "system",
      label: "System",
      icon: "Settings",
      roles: ["clinic-staff", "pho-official", "lab-personnel"],
      items: [
        {
          label: "Authentication",
          path: "/login-authentication",
          icon: "Lock",
          roles: ["clinic-staff", "pho-official", "lab-personnel"],
        },
      ],
    },
  ];

  const effectiveRole = authRole || userRole;
  const visibleSections = navigationSections?.filter((section) =>
    section?.roles?.includes(effectiveRole)
  );

  const isActive = (path) => location?.pathname === path;

  const toggleSection = (sectionId) => {
    if (isCollapsed) return;

    setExpandedSections((prev) =>
      prev?.includes(sectionId)
        ? prev?.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login-authentication", { replace: true });
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-card border-r border-border shadow-clinical z-1000 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  MHRS Portal
                </h2>
                <p className="text-xs text-muted-foreground">
                  Healthcare System
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-muted transition-clinical"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              size={16}
            />
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <button
              onClick={() => handleNavigation("/patient-search-results")}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent transition-clinical"
            >
              <Icon name="Search" size={16} />
              <span>Search patients...</span>
              <div className="ml-auto">
                <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {visibleSections?.map((section) => {
              const isExpanded = expandedSections?.includes(section?.id);
              const visibleItems = section?.items?.filter((item) =>
                item?.roles?.includes(effectiveRole)
              );

              return (
                <div key={section?.id} className="space-y-1">
                  <button
                    onClick={() => toggleSection(section?.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-sm font-medium transition-clinical ${
                      isCollapsed
                        ? "justify-center"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    title={isCollapsed ? section?.label : undefined}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name={section?.icon} size={16} />
                      {!isCollapsed && <span>{section?.label}</span>}
                    </div>
                    {!isCollapsed && visibleItems?.length > 1 && (
                      <Icon
                        name="ChevronDown"
                        size={14}
                        className={`transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {/* Section Items */}
                  {!isCollapsed &&
                    (isExpanded || visibleItems?.length === 1) && (
                      <div className="ml-4 space-y-1">
                        {visibleItems?.map((item) => (
                          <button
                            key={item?.path}
                            onClick={() => handleNavigation(item?.path)}
                            className={`w-full flex items-center space-x-2 p-2 rounded-md text-sm transition-clinical ${
                              isActive(item?.path)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon name={item?.icon} size={14} />
                            <span>{item?.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  {/* Collapsed State Items */}
                  {isCollapsed && (
                    <div className="space-y-1">
                      {visibleItems?.map((item) => (
                        <button
                          key={item?.path}
                          onClick={() => handleNavigation(item?.path)}
                          className={`w-full flex items-center justify-center p-2 rounded-md transition-clinical ${
                            isActive(item?.path)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                          title={item?.label}
                        >
                          <Icon name={item?.icon} size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div
            className={`flex items-center space-x-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Dr. Sarah Johnson
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {effectiveRole?.replace("-", " ")}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-3 space-y-1">
              <button
                onClick={() => handleNavigation("/profile")}
                className="w-full flex items-center space-x-2 p-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="Settings" size={14} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-2 rounded-md text-sm text-error hover:bg-error/10 transition-clinical"
              >
                <Icon name="LogOut" size={14} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div
          className={`p-4 border-t border-border ${
            isCollapsed ? "text-center" : ""
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle"></div>
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">
                System Online
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

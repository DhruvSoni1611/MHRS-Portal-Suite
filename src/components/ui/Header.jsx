import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import { useAuth } from "../../utils/auth.jsx";

const Header = ({
  userRole = "clinic-staff",
  onMenuToggle,
  isMenuOpen = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role: authRole, logout } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (authRole && authRole !== userRole) {
      // Prefer context role over prop if provided
    }
  }, [authRole, userRole]);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/multi-portal-dashboard",
      icon: "LayoutDashboard",
      roles: ["clinic-staff", "pho-official", "lab-personnel"],
    },
    {
      label: "Patients",
      path: "/patient-search-results",
      icon: "Users",
      roles: ["clinic-staff", "lab-personnel"],
    },
    {
      label: "Analytics",
      path: "/pho-analytics-dashboard",
      icon: "BarChart3",
      roles: ["pho-official"],
    },
    {
      label: "Enrollment",
      path: "/patient-enrollment-workflow",
      icon: "UserPlus",
      roles: ["clinic-staff"],
    },
  ];

  const moreItems = [
    {
      label: "Settings",
      path: "/settings",
      icon: "Settings",
      roles: ["clinic-staff", "pho-official", "lab-personnel"],
    },
    {
      label: "Help",
      path: "/help",
      icon: "HelpCircle",
      roles: ["clinic-staff", "pho-official", "lab-personnel"],
    },
    {
      label: "Admin",
      path: "/admin",
      icon: "Shield",
      roles: ["pho-official"],
    },
  ];

  const effectiveRole = authRole || userRole;
  const visibleItems = navigationItems?.filter((item) =>
    item?.roles?.includes(effectiveRole)
  );
  const visibleMoreItems = moreItems?.filter((item) =>
    item?.roles?.includes(effectiveRole)
  );

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login-authentication", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border shadow-clinical">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-clinical"
            aria-label="Toggle menu"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">
                MHRS Portal Suite
              </h1>
              <p className="text-xs text-muted-foreground">
                Healthcare Management System
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {visibleItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-clinical ${
                isActive(item?.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          ))}

          {visibleMoreItems?.length > 0 && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowProfileMenu(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span>More</span>
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-clinical-lg z-1200">
                  <div className="py-1">
                    {visibleMoreItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => {
                          handleNavigation(item?.path);
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User Profile and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button
            onClick={() => handleNavigation("/patient-search-results")}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
            aria-label="Search patients"
          >
            <Icon name="Search" size={20} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowMoreMenu(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-clinical"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  Dr. Sarah Johnson
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {effectiveRole?.replace("-", " ")}
                </p>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className="text-muted-foreground"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-clinical-lg z-1200">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">
                      Dr. Sarah Johnson
                    </p>
                    <p className="text-xs text-muted-foreground">
                      sarah.johnson@mhrs.gov
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleNavigation("/profile");
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation("/settings");
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error hover:bg-muted transition-clinical"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-1100">
          <nav className="p-4 space-y-2">
            {visibleItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => {
                  handleNavigation(item?.path);
                  onMenuToggle();
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-md text-left transition-clinical ${
                  isActive(item?.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.label}</span>
              </button>
            ))}

            {visibleMoreItems?.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  More Options
                </p>
                {visibleMoreItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => {
                      handleNavigation(item?.path);
                      onMenuToggle();
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-md text-left text-foreground hover:bg-muted transition-clinical"
                  >
                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                  </button>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

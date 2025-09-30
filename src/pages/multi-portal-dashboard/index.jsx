import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import QuickSearchBar from "./components/QuickSearchBar";
import RoleBasedModules from "./components/RoleBasedModules";
import SystemStatusBar from "./components/SystemStatusBar";
import RecentActivityFeed from "./components/RecentActivityFeed";
import QuickStatsCards from "./components/QuickStatsCards";
import { useAuth } from "../../utils/auth";

const MultiPortalDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("clinic-staff");
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const { logout, role } = useAuth();

  useEffect(() => {
    // Load saved preferences
    const savedLanguage = localStorage.getItem("mhrs-language") || "EN";
    const savedRole =
      role ||
      localStorage.getItem("userRole") ||
      localStorage.getItem("mhrs-user-role") ||
      "clinic-staff";
    setCurrentLanguage(savedLanguage);
    setUserRole(savedRole);
  }, [role]);

  const roleDisplayNames = {
    "clinic-staff": "Clinic Staff Portal",
    "pho-official": "Public Health Official Portal",
    "lab-personnel": "Laboratory Personnel Portal",
  };

  const welcomeMessages = {
    EN: {
      welcome: "Welcome back",
      subtitle: "Here's what's happening in your healthcare system today",
      quickActions: "Quick Actions",
    },
    HI: {
      welcome: "वापसी पर स्वागत है",
      subtitle: "आज आपके स्वास्थ्य सेवा प्रणाली में क्या हो रहा है",
      quickActions: "त्वरित कार्य",
    },
    BN: {
      welcome: "ফিরে আসার জন্য স্বাগতম",
      subtitle: "আজ আপনার স্বাস্থ্যসেবা ব্যবস্থায় কী ঘটছে তা এখানে",
      quickActions: "দ্রুত কর্ম",
    },
    ML: {
      welcome: "തിരിച്ചുവരവിനെ സ്വാഗതം",
      subtitle: "ഇന്ന് നിങ്ങളുടെ ആരോഗ്യ സംവിധാനത്തിൽ എന്താണ് സംഭവിക്കുന്നത്",
      quickActions: "വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ",
    },
  };

  const currentMessages =
    welcomeMessages?.[currentLanguage] || welcomeMessages?.["EN"];

  const getQuickActionsForRole = (role) => {
    const actions = {
      "clinic-staff": [
        {
          label: "Search Patient",
          icon: "Search",
          path: "/patient-search-results",
          color: "bg-blue-500 hover:bg-blue-600",
        },
        {
          label: "New Enrollment",
          icon: "UserPlus",
          path: "/patient-enrollment-workflow",
          color: "bg-green-500 hover:bg-green-600",
        },
        {
          label: "Patient Profile",
          icon: "User",
          path: "/patient-summary-profile",
          color: "bg-purple-500 hover:bg-purple-600",
        },
      ],
      "pho-official": [
        {
          label: "Analytics Dashboard",
          icon: "BarChart3",
          path: "/pho-analytics-dashboard",
          color: "bg-indigo-500 hover:bg-indigo-600",
        },
        {
          label: "Health Alerts",
          icon: "AlertTriangle",
          path: "/pho-analytics-dashboard",
          color: "bg-red-500 hover:bg-red-600",
        },
        {
          label: "Disease Map",
          icon: "MapPin",
          path: "/pho-analytics-dashboard",
          color: "bg-orange-500 hover:bg-orange-600",
        },
      ],
      "lab-personnel": [
        {
          label: "Lab Orders",
          icon: "TestTube",
          path: "/lab-order-management",
          color: "bg-cyan-500 hover:bg-cyan-600",
        },
        {
          label: "Upload Results",
          icon: "Upload",
          path: "/lab-order-management?action=upload",
          color: "bg-teal-500 hover:bg-teal-600",
        },
        {
          label: "Quality Control",
          icon: "Award",
          path: "/lab-order-management?action=qc",
          color: "bg-yellow-500 hover:bg-yellow-600",
        },
      ],
    };

    return actions?.[role] || [];
  };

  const quickActions = getQuickActionsForRole(userRole);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {currentMessages?.welcome}, Dr. Sarah Johnson
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {currentMessages?.subtitle}
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {roleDisplayNames?.[userRole]}
                </div>
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/login-authentication", { replace: true });
                }}
                iconName="LogOut"
                iconPosition="left"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* System Status Bar */}
          <SystemStatusBar />
        </div>

        {/* Quick Search */}
        <div className="mb-8">
          <QuickSearchBar userRole={userRole} />
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Dashboard Overview
          </h2>
          <QuickStatsCards userRole={userRole} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Role-based Modules */}
          <div className="lg:col-span-2">
            <RoleBasedModules userRole={userRole} />
          </div>

          {/* Recent Activity Feed */}
          <div className="lg:col-span-1">
            <RecentActivityFeed userRole={userRole} />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="bg-card rounded-lg border border-border p-6 shadow-clinical">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {currentMessages?.quickActions}
              </h3>
              <div className="text-sm text-muted-foreground">
                Frequently used functions
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions?.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action?.path)}
                  className={`${action?.color} text-white p-4 rounded-lg transition-clinical flex items-center space-x-3 hover:shadow-clinical-lg`}
                >
                  <Icon name={action?.icon} size={24} color="white" />
                  <span className="font-medium">{action?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-clinical">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} color="white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  MHRS Portal Suite
                </h4>
                <p className="text-xs text-muted-foreground">
                  Healthcare Management System v2.1.0
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={14} />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Globe" size={14} />
                <span>Multi-Language Support</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} Ministry of Health & Family Welfare,
              Government of India
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiPortalDashboard;

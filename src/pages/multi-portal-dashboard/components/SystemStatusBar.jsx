import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";

const SystemStatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState("EN");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load saved preferences
    const savedLanguage = localStorage.getItem("mhrs-language") || "EN";
    const savedTheme = localStorage.getItem("mhrs-theme") || "light";
    setLanguage(savedLanguage);
    setTheme(savedTheme);

    return () => clearInterval(timer);
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("mhrs-language", newLanguage);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("mhrs-theme", newTheme);
  };

  const languages = [
    { code: "EN", label: "English", flag: "🇺🇸" },
    { code: "HI", label: "हिंदी", flag: "🇮🇳" },
    { code: "BN", label: "বাংলা", flag: "🇧🇩" },
    { code: "ML", label: "മലയാളം", flag: "🇮🇳" },
  ];

  const systemStatus = {
    database: { status: "online", latency: "12ms" },
    api: { status: "online", latency: "45ms" },
    sync: { status: "synced", lastSync: "2 min ago" },
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-clinical">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* System Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              System Online
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Database" size={14} />
              <span>DB: {systemStatus?.database?.latency}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Wifi" size={14} />
              <span>API: {systemStatus?.api?.latency}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="RefreshCw" size={14} />
              <span>Sync: {systemStatus?.sync?.lastSync}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Current Time */}
          <div className="text-sm text-muted-foreground">
            {currentTime?.toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e?.target?.value)}
              className="bg-muted border border-border rounded-md px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {languages?.map((lang) => (
                <option key={lang?.code} value={lang?.code}>
                  {lang?.flag} {lang?.code}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-md hover:bg-muted transition-clinical"
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            <Icon
              name={theme === "light" ? "Moon" : "Sun"}
              size={16}
              className="text-muted-foreground"
            />
          </button>

          {/* Sync Status */}
          <button className="flex items-center space-x-2 px-3 py-1 bg-success/10 text-success rounded-md text-sm">
            <Icon name="CheckCircle" size={14} />
            <span>Synced</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusBar;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import OrdersTable from "./components/OrdersTable";
import FilterPanel from "./components/FilterPanel";
import ResultUploadModal from "./components/ResultUploadModal";
import OrderDetailsPanel from "./components/OrderDetailsPanel";
import LabAlertsPanel from "./components/LabAlertsPanel";

const LabOrderManagement = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    testType: "all",
    dateRange: "all",
    facility: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table"); // 'table' or 'cards'
  const location = useLocation();
  const alertsRef = useRef(null);
  const [alerts, setAlerts] = useState([
    {
      id: "ALERT-001",
      orderId: "LAB-2024-003",
      patientName: "Maria Garcia",
      title: "CRITICAL: Potassium 6.8 mmol/L",
      message:
        "Critical hyperkalemia detected. Immediate physician notification required.",
      severity: "critical",
      acknowledged: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "ALERT-002",
      orderId: "LAB-2024-002",
      patientName: "Robert Kumar",
      title: "High HbA1c 9.1%",
      message: "Levels indicate poor glycemic control. Flag for follow-up.",
      severity: "high",
      acknowledged: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "ALERT-003",
      orderId: "LAB-2024-001",
      patientName: "Sarah Johnson",
      title: "Specimen Stability Warning",
      message: "CBC sample nearing stability limit. Process within 1 hour.",
      severity: "low",
      acknowledged: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  // Mock lab orders data
  const [labOrders, setLabOrders] = useState([
    {
      id: "LAB-2024-001",
      patientId: "P001",
      patientName: "Sarah Johnson",
      patientAge: 45,
      patientGender: "Female",
      testTypes: ["Complete Blood Count", "Lipid Panel"],
      priority: "routine",
      status: "collected",
      collectionDate: "2024-09-18",
      dueDate: "2024-09-20",
      orderingPhysician: "Dr. Michael Chen",
      orderingFacility: "Central Clinic",
      turnaroundTime: "2 days",
      preparation: "Fasting required - 12 hours",
      specialInstructions: "Handle with care - hemolysis risk",
    },
    {
      id: "LAB-2024-002",
      patientId: "P002",
      patientName: "Robert Kumar",
      patientAge: 58,
      patientGender: "Male",
      testTypes: ["HbA1c", "Glucose Tolerance Test"],
      priority: "urgent",
      status: "in-progress",
      collectionDate: "2024-09-19",
      dueDate: "2024-09-20",
      orderingPhysician: "Dr. Priya Sharma",
      orderingFacility: "Diabetes Care Center",
      turnaroundTime: "1 day",
      preparation: "No special preparation",
      specialInstructions: "Critical value alert enabled",
    },
    {
      id: "LAB-2024-003",
      patientId: "P003",
      patientName: "Maria Garcia",
      patientAge: 34,
      patientGender: "Female",
      testTypes: ["Pregnancy Test", "Complete Metabolic Panel"],
      priority: "stat",
      status: "overdue",
      collectionDate: "2024-09-17",
      dueDate: "2024-09-19",
      orderingPhysician: "Dr. Amanda Wilson",
      orderingFacility: "Women's Health Clinic",
      turnaroundTime: "4 hours",
      preparation: "First morning urine preferred",
      specialInstructions: "Rush processing required",
    },
  ]);

  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 156,
    pendingCollection: 23,
    inProgress: 45,
    completed: 88,
    overdue: 8,
    criticalAlerts: 3,
  });

  const priorityColors = {
    routine: "text-blue-600 bg-blue-50",
    urgent: "text-orange-600 bg-orange-50",
    stat: "text-red-600 bg-red-50",
  };

  const statusColors = {
    pending: "text-yellow-600 bg-yellow-50",
    collected: "text-blue-600 bg-blue-50",
    "in-progress": "text-indigo-600 bg-indigo-50",
    completed: "text-green-600 bg-green-50",
    overdue: "text-red-600 bg-red-50",
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setShowDetailsPanel(true);
  };

  const handleUploadResults = (order) => {
    setSelectedOrder(order);
    setShowUploadModal(true);
  };

  const handleAcknowledgeAlert = (alert) => {
    setAlerts((prev) =>
      prev?.map((a) => (a?.id === alert?.id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleViewAlertOrder = (alert) => {
    const order = labOrders?.find((o) => o?.id === alert?.orderId);
    if (order) {
      setSelectedOrder(order);
      setShowDetailsPanel(true);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredOrders = labOrders?.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order?.patientName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      order?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      order?.orderingPhysician
        ?.toLowerCase()
        ?.includes(searchQuery?.toLowerCase());

    const matchesStatus =
      filters?.status === "all" || order?.status === filters?.status;
    const matchesPriority =
      filters?.priority === "all" || order?.priority === filters?.priority;
    const matchesFacility =
      filters?.facility === "all" ||
      order?.orderingFacility === filters?.facility;

    return matchesSearch && matchesStatus && matchesPriority && matchesFacility;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    if (action === "upload") {
      const order =
        labOrders.find((o) => o.status !== "completed") || labOrders[0];
      if (order) handleUploadResults(order);
    }
    if (action === "qc" && alertsRef?.current) {
      alertsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Lab Order Management
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Comprehensive order tracking and result management for
                laboratory personnel
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Laboratory Portal
                </div>
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  Real-time sync active
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setView(view === "table" ? "cards" : "table")}
                iconName={view === "table" ? "LayoutGrid" : "Table"}
                iconPosition="left"
              >
                {view === "table" ? "Card View" : "Table View"}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/multi-portal-dashboard")}
                iconName="Home"
                iconPosition="left"
              >
                Dashboard
              </Button>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4 shadow-clinical">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="TestTube" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardStats?.totalOrders}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 shadow-clinical">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardStats?.pendingCollection}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pending Collection
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 shadow-clinical">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardStats?.inProgress}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 shadow-clinical">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon
                    name="CheckCircle"
                    size={20}
                    className="text-green-600"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardStats?.completed}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 shadow-clinical">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Icon
                    name="AlertTriangle"
                    size={20}
                    className="text-red-600"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardStats?.overdue}
                  </p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 shadow-clinical">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {dashboardStats?.criticalAlerts}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Critical Alerts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search orders, patients, or physicians..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="default"
                iconName="Upload"
                iconPosition="left"
                onClick={() => setShowUploadModal(true)}
              >
                Batch Upload
              </Button>
              <Button variant="outline" iconName="Download" iconPosition="left">
                Export Report
              </Button>
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="xl:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              labOrders={labOrders}
            />
          </div>

          {/* Orders Table */}
          <div className="xl:col-span-2">
            <OrdersTable
              orders={filteredOrders}
              view={view}
              onOrderSelect={handleOrderSelect}
              onUploadResults={handleUploadResults}
              priorityColors={priorityColors}
              statusColors={statusColors}
            />
          </div>

          {/* Alerts Panel */}
          <div className="xl:col-span-1" ref={alertsRef}>
            <LabAlertsPanel
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onViewOrder={handleViewAlertOrder}
            />
          </div>
        </div>

        {/* Modals */}
        {showUploadModal && (
          <ResultUploadModal
            order={selectedOrder}
            onClose={() => {
              setShowUploadModal(false);
              setSelectedOrder(null);
            }}
            onUploadComplete={(payload) => {
              setShowUploadModal(false);
              setSelectedOrder(null);
              // Simulate persisting new result and marking order completed
              setLabOrders((prev) =>
                prev?.map((o) =>
                  o?.id === payload?.orderId ? { ...o, status: "completed" } : o
                )
              );
              setDashboardStats((prev) => ({
                ...prev,
                completed: prev.completed + 1,
                inProgress: Math.max(prev.inProgress - 1, 0),
              }));
              // Resolve any alerts for that order
              setAlerts((prev) =>
                prev?.map((a) =>
                  a?.orderId === payload?.orderId
                    ? { ...a, acknowledged: true }
                    : a
                )
              );
            }}
          />
        )}

        {showDetailsPanel && selectedOrder && (
          <OrderDetailsPanel
            order={selectedOrder}
            onClose={() => {
              setShowDetailsPanel(false);
              setSelectedOrder(null);
            }}
            onUploadResults={handleUploadResults}
            priorityColors={priorityColors}
            statusColors={statusColors}
          />
        )}

        {/* Footer Information */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6 shadow-clinical">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="TestTube" size={20} color="white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Lab Information System
                </h4>
                <p className="text-xs text-muted-foreground">
                  Laboratory Order Management v2.1.0
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} />
                <span>CLIA Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Zap" size={14} />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Award" size={14} />
                <span>Quality Assured</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Laboratory Information System - MHRS Portal Suite
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabOrderManagement;

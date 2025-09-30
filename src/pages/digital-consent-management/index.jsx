import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import ConsentRequestModal from "./components/ConsentRequestModal";
import ConsentTrackingTable from "./components/ConsentTrackingTable";
import BulkConsentModal from "./components/BulkConsentModal";
import ConsentHistoryModal from "./components/ConsentHistoryModal";

const DigitalConsentManagement = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [consents, setConsents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
    withdrawn: 0,
  });

  // Mock consent data
  useEffect(() => {
    const mockConsents = [
      {
        id: "CON-001",
        patientId: "P-001",
        patientName: "Sarah Johnson",
        type: "treatment",
        typeLabel: "Treatment Authorization",
        status: "active",
        collectedDate: "2024-01-15",
        expiryDate: "2025-01-15",
        collectionMethod: "digital",
        version: "2.1",
        consentBy: "Patient",
        withdrawnDate: null,
        notes: "Standard treatment consent",
      },
      {
        id: "CON-002",
        patientId: "P-002",
        patientName: "Michael Chen",
        type: "data-sharing",
        typeLabel: "Data Sharing",
        status: "pending",
        collectedDate: null,
        expiryDate: null,
        collectionMethod: "otp",
        version: "1.0",
        consentBy: null,
        withdrawnDate: null,
        notes: "Awaiting OTP verification",
      },
      {
        id: "CON-003",
        patientId: "P-003",
        patientName: "Emily Davis",
        type: "research",
        typeLabel: "Research Participation",
        status: "active",
        collectedDate: "2024-01-10",
        expiryDate: "2024-12-31",
        collectionMethod: "digital",
        version: "3.2",
        consentBy: "Legal Guardian",
        withdrawnDate: null,
        notes: "Pediatric research consent",
      },
      {
        id: "CON-004",
        patientId: "P-004",
        patientName: "Robert Wilson",
        type: "treatment",
        typeLabel: "Treatment Authorization",
        status: "expired",
        collectedDate: "2023-01-15",
        expiryDate: "2024-01-15",
        collectionMethod: "paper",
        version: "1.5",
        consentBy: "Patient",
        withdrawnDate: null,
        notes: "Requires renewal",
      },
      {
        id: "CON-005",
        patientId: "P-005",
        patientName: "Lisa Anderson",
        type: "data-sharing",
        typeLabel: "Data Sharing",
        status: "withdrawn",
        collectedDate: "2024-01-05",
        expiryDate: "2025-01-05",
        collectionMethod: "digital",
        version: "2.0",
        consentBy: "Patient",
        withdrawnDate: "2024-01-20",
        notes: "Patient requested withdrawal",
      },
    ];

    setConsents(mockConsents);

    // Calculate stats
    const totalCount = mockConsents?.length;
    const activeCount = mockConsents?.filter(
      (c) => c?.status === "active"
    )?.length;
    const pendingCount = mockConsents?.filter(
      (c) => c?.status === "pending"
    )?.length;
    const expiredCount = mockConsents?.filter(
      (c) => c?.status === "expired"
    )?.length;
    const withdrawnCount = mockConsents?.filter(
      (c) => c?.status === "withdrawn"
    )?.length;

    setStats({
      total: totalCount,
      active: activeCount,
      pending: pendingCount,
      expired: expiredCount,
      withdrawn: withdrawnCount,
    });
  }, []);

  // Filter consents based on search and filters
  const filteredConsents = consents?.filter((consent) => {
    const matchesSearch =
      consent?.patientName
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      consent?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      consent?.patientId?.toLowerCase()?.includes(searchTerm?.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || consent?.status === filterStatus;
    const matchesType = filterType === "all" || consent?.type === filterType;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && consent?.status === "active") ||
      (activeTab === "pending" && consent?.status === "pending") ||
      (activeTab === "expired" && consent?.status === "expired") ||
      (activeTab === "withdrawn" && consent?.status === "withdrawn");

    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const handleNewConsent = () => {
    setSelectedConsent(null);
    setShowConsentModal(true);
  };

  const handleViewHistory = (consent) => {
    setSelectedConsent(consent);
    setShowHistoryModal(true);
  };

  const handleEditConsent = (consent) => {
    setSelectedConsent(consent);
    setShowConsentModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "text-green-700 bg-green-100",
      pending: "text-yellow-700 bg-yellow-100",
      expired: "text-red-700 bg-red-100",
      withdrawn: "text-gray-700 bg-gray-100",
    };
    return colors?.[status] || "text-gray-700 bg-gray-100";
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      pending: Clock,
      expired: AlertTriangle,
      withdrawn: FileCheck,
    };
    const IconComponent = icons?.[status] || FileCheck;
    return <IconComponent className="h-4 w-4" />;
  };

  const tabs = [
    {
      id: "active",
      label: "Active",
      count: stats?.active,
      color: "text-green-600",
    },
    {
      id: "pending",
      label: "Pending",
      count: stats?.pending,
      color: "text-yellow-600",
    },
    {
      id: "expired",
      label: "Expired",
      count: stats?.expired,
      color: "text-red-600",
    },
    {
      id: "withdrawn",
      label: "Withdrawn",
      count: stats?.withdrawn,
      color: "text-gray-600",
    },
    {
      id: "all",
      label: "All Consents",
      count: stats?.total,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Digital Consent Management" onMenuToggle={() => {}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {tabs?.slice(0, 4)?.map((tab) => (
            <div key={tab?.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full ${
                    tab?.id === "active"
                      ? "bg-green-100"
                      : tab?.id === "pending"
                      ? "bg-yellow-100"
                      : tab?.id === "expired"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  {getStatusIcon(tab?.id)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    {tab?.label}
                  </p>
                  <p className={`text-2xl font-bold ${tab?.color}`}>
                    {tab?.count}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleNewConsent}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Consent Request
            </Button>
            <Button
              onClick={() => setShowBulkModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Bulk Operations
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by patient name, consent ID, or patient ID..."
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e?.target?.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e?.target?.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="treatment">Treatment</option>
                <option value="data-sharing">Data Sharing</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab?.label}
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab?.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab?.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Consent Table */}
          <ConsentTrackingTable
            consents={filteredConsents}
            onViewHistory={handleViewHistory}
            onEditConsent={handleEditConsent}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        </div>
      </div>
      {/* Modals */}
      {showConsentModal && (
        <ConsentRequestModal
          consent={selectedConsent}
          onClose={() => {
            setShowConsentModal(false);
            setSelectedConsent(null);
          }}
          onSave={(consentData) => {
            // Handle consent save
            console.log("Consent saved:", consentData);
            setShowConsentModal(false);
            setSelectedConsent(null);
          }}
        />
      )}
      {showBulkModal && (
        <BulkConsentModal
          onClose={() => setShowBulkModal(false)}
          onSubmit={(bulkData) => {
            console.log("Bulk operation:", bulkData);
            setShowBulkModal(false);
          }}
        />
      )}
      {showHistoryModal && selectedConsent && (
        <ConsentHistoryModal
          consent={selectedConsent}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedConsent(null);
          }}
        />
      )}
    </div>
  );
};

export default DigitalConsentManagement;

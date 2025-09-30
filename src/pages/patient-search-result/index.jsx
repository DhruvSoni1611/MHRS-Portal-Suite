import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import SearchFilters from "./components/SearchFilters";
import PatientTable from "./components/PatientTable";
import PatientCards from "./components/PatientCards";
import QRScanModal from "./components/QRScanModal";
import Pagination from "./components/Pagination";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const PatientSearchResults = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    ageRange: "",
    registrationPeriod: "",
  });
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Mock patient data
  const mockPatients = [
    {
      id: "PAT001",
      patientId: "MHRS-2025-001",
      name: "Rajesh Kumar Singh",
      phone: "+91-9876543210",
      abhaId: "12-3456-7890-1234",
      age: 45,
      gender: "male",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      lastVisit: "2025-01-15",
      status: "active",
      registrationDate: "2024-03-15",
    },
    {
      id: "PAT002",
      patientId: "MHRS-2025-002",
      name: "Priya Sharma",
      phone: "+91-9876543211",
      abhaId: "12-3456-7890-1235",
      age: 32,
      gender: "female",
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      lastVisit: "2025-01-18",
      status: "active",
      registrationDate: "2024-05-20",
    },
    {
      id: "PAT003",
      patientId: "MHRS-2025-003",
      name: "Mohammed Ali Khan",
      phone: "+91-9876543212",
      abhaId: null,
      age: 28,
      gender: "male",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      lastVisit: "2025-01-10",
      status: "pending",
      registrationDate: "2024-12-01",
    },
    {
      id: "PAT004",
      patientId: "MHRS-2025-004",
      name: "Sunita Devi",
      phone: "+91-9876543213",
      abhaId: "12-3456-7890-1237",
      age: 58,
      gender: "female",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      lastVisit: "2024-12-28",
      status: "active",
      registrationDate: "2024-01-10",
    },
    {
      id: "PAT005",
      patientId: "MHRS-2025-005",
      name: "Amit Patel",
      phone: "+91-9876543214",
      abhaId: "12-3456-7890-1238",
      age: 41,
      gender: "male",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      lastVisit: null,
      status: "inactive",
      registrationDate: "2024-08-15",
    },
    {
      id: "PAT006",
      patientId: "MHRS-2025-006",
      name: "Kavita Reddy",
      phone: "+91-9876543215",
      abhaId: "12-3456-7890-1239",
      age: 35,
      gender: "female",
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      lastVisit: "2025-01-19",
      status: "active",
      registrationDate: "2024-06-30",
    },
    {
      id: "PAT007",
      patientId: "MHRS-2025-007",
      name: "Ravi Gupta",
      phone: "+91-9876543216",
      abhaId: null,
      age: 52,
      gender: "male",
      photo:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      lastVisit: "2025-01-12",
      status: "active",
      registrationDate: "2024-02-28",
    },
    {
      id: "PAT008",
      patientId: "MHRS-2025-008",
      name: "Meera Joshi",
      phone: "+91-9876543217",
      abhaId: "12-3456-7890-1241",
      age: 29,
      gender: "female",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      lastVisit: "2025-01-16",
      status: "active",
      registrationDate: "2024-09-10",
    },
  ];

  // Filter and search patients
  const getFilteredPatients = () => {
    let filtered = [...mockPatients];

    // Apply search query
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(
        (patient) =>
          patient?.name?.toLowerCase()?.includes(query) ||
          patient?.phone?.includes(query) ||
          patient?.patientId?.toLowerCase()?.includes(query) ||
          (patient?.abhaId && patient?.abhaId?.includes(query))
      );
    }

    // Apply filters
    if (filters?.gender) {
      filtered = filtered?.filter(
        (patient) => patient?.gender === filters?.gender
      );
    }

    if (filters?.ageRange) {
      const [min, max] = filters?.ageRange?.includes("+")
        ? [parseInt(filters?.ageRange), 999]
        : filters?.ageRange?.split("-")?.map(Number);
      filtered = filtered?.filter(
        (patient) => patient?.age >= min && patient?.age <= max
      );
    }

    if (filters?.registrationPeriod) {
      const now = new Date();
      const filterDate = new Date();

      switch (filters?.registrationPeriod) {
        case "today":
          filterDate?.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate?.setDate(now?.getDate() - 7);
          break;
        case "month":
          filterDate?.setMonth(now?.getMonth() - 1);
          break;
        case "quarter":
          filterDate?.setMonth(now?.getMonth() - 3);
          break;
        case "year":
          filterDate?.setFullYear(now?.getFullYear() - 1);
          break;
        default:
          filterDate?.setFullYear(1900);
      }

      filtered = filtered?.filter(
        (patient) => new Date(patient.registrationDate) >= filterDate
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === "lastVisit") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      if (typeof aValue === "string") {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredPatients = getFilteredPatients();
  const totalPages = Math.ceil(filteredPatients?.length / itemsPerPage);
  const paginatedPatients = filteredPatients?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query?.trim()) {
      setLoading(true);
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const handleClearFilters = () => {
    setFilters({
      gender: "",
      ageRange: "",
      registrationPeriod: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSort = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
  };

  const handleQRScan = () => {
    setShowQRModal(true);
  };

  const handleQRScanResult = (token) => {
    setSearchQuery(token);
    setCurrentPage(1);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleViewPatient = (patientId) => {
    window.location.href = `/patient-summary-profile?id=${patientId}`;
  };

  const handleCreateEncounter = (patientId) => {
    // Mock encounter creation
    alert(`Creating new encounter for patient ${patientId}`);
  };

  const handleRequestConsent = (patientId) => {
    // Mock consent request
    alert(`Requesting consent from patient ${patientId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="clinic-staff"
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />
      <div className="flex">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole="clinic-staff"
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-60"
          } pt-16`}
        >
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    Patient Search
                  </h1>
                  <p className="text-muted-foreground">
                    Find and manage patient records across the healthcare system
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="hidden md:flex bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      iconName="Table"
                      className="px-3"
                    />
                    <Button
                      variant={viewMode === "cards" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("cards")}
                      iconName="Grid3X3"
                      className="px-3"
                    />
                  </div>

                  <Button
                    variant="default"
                    onClick={() =>
                      (window.location.href = "/patient-enrollment-workflow")
                    }
                    iconName="UserPlus"
                    iconPosition="left"
                  >
                    New Patient
                  </Button>
                </div>
              </div>

              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <button
                  onClick={() =>
                    (window.location.href = "/multi-portal-dashboard")
                  }
                  className="hover:text-foreground transition-clinical"
                >
                  Dashboard
                </button>
                <Icon name="ChevronRight" size={14} />
                <span className="text-foreground">Patient Search</span>
              </nav>
            </div>

            {/* Search Filters */}
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              resultCount={filteredPatients?.length}
              onQRScan={handleQRScan}
            />

            {/* Results */}
            <div className="space-y-4">
              {viewMode === "table" ? (
                <PatientTable
                  patients={paginatedPatients}
                  loading={loading}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onViewPatient={handleViewPatient}
                  onCreateEncounter={handleCreateEncounter}
                  onRequestConsent={handleRequestConsent}
                />
              ) : (
                <PatientCards
                  patients={paginatedPatients}
                  loading={loading}
                  onViewPatient={handleViewPatient}
                  onCreateEncounter={handleCreateEncounter}
                  onRequestConsent={handleRequestConsent}
                />
              )}

              {/* Pagination */}
              {filteredPatients?.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredPatients?.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      {/* QR Scan Modal */}
      <QRScanModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onScanResult={handleQRScanResult}
      />
    </div>
  );
};

export default PatientSearchResults;

import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const PatientTable = ({
  patients,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onViewPatient,
  onCreateEncounter,
  onRequestConsent,
}) => {
  const [selectedPatients, setSelectedPatients] = useState([]);

  const columns = [
    { key: "photo", label: "", sortable: false, width: "w-16" },
    { key: "name", label: "Patient Name", sortable: true, width: "w-48" },
    { key: "phone", label: "Phone", sortable: true, width: "w-32" },
    { key: "abhaId", label: "ABHA ID", sortable: true, width: "w-40" },
    { key: "age", label: "Age", sortable: true, width: "w-20" },
    { key: "gender", label: "Gender", sortable: true, width: "w-24" },
    { key: "lastVisit", label: "Last Visit", sortable: true, width: "w-32" },
    { key: "status", label: "Status", sortable: false, width: "w-24" },
    { key: "actions", label: "Actions", sortable: false, width: "w-40" },
  ];

  const handleSort = (columnKey) => {
    if (columnKey === sortBy) {
      onSort(columnKey, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSort(columnKey, "asc");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-success text-success-foreground", label: "Active" },
      inactive: { color: "bg-muted text-muted-foreground", label: "Inactive" },
      pending: {
        color: "bg-warning text-warning-foreground",
        label: "Pending",
      },
    };

    const config = statusConfig?.[status] || statusConfig?.active;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}
      >
        {config?.label}
      </span>
    );
  };

  const togglePatientSelection = (patientId) => {
    setSelectedPatients((prev) =>
      prev?.includes(patientId)
        ? prev?.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedPatients?.length === patients?.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(patients?.map((p) => p?.id));
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {columns?.map((column) => (
                  <th
                    key={column?.key}
                    className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${column?.width}`}
                  >
                    {column?.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...Array(5)]?.map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-28"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-8"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 bg-muted rounded-full w-16"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (patients?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon
          name="Users"
          size={48}
          className="mx-auto text-muted-foreground mb-4"
        />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No patients found
        </h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search criteria or filters to find patients.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            (window.location.href = "/patient-enrollment-workflow")
          }
          iconName="UserPlus"
          iconPosition="left"
        >
          Enroll New Patient
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Bulk Actions */}
      {selectedPatients?.length > 0 && (
        <div className="bg-accent/10 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedPatients?.length} patient
              {selectedPatients?.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedPatients?.length === patients?.length}
                  onChange={toggleAllSelection}
                  className="rounded border-border"
                />
              </th>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${column?.width}`}
                >
                  {column?.sortable ? (
                    <button
                      onClick={() => handleSort(column?.key)}
                      className="flex items-center gap-1 hover:text-foreground transition-clinical"
                    >
                      {column?.label}
                      {sortBy === column?.key && (
                        <Icon
                          name={
                            sortOrder === "asc" ? "ChevronUp" : "ChevronDown"
                          }
                          size={14}
                        />
                      )}
                    </button>
                  ) : (
                    column?.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients?.map((patient) => (
              <tr
                key={patient?.id}
                className="hover:bg-muted/30 transition-clinical cursor-pointer"
                onClick={() => onViewPatient(patient?.id)}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPatients?.includes(patient?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      togglePatientSelection(patient?.id);
                    }}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-4">
                  <Image
                    src={patient?.photo}
                    alt={patient?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-foreground">
                      {patient?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {patient?.patientId}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-foreground">
                  {patient?.phone}
                </td>
                <td className="px-4 py-4 text-sm text-foreground">
                  {patient?.abhaId || "Not linked"}
                </td>
                <td className="px-4 py-4 text-sm text-foreground">
                  {patient?.age}
                </td>
                <td className="px-4 py-4 text-sm text-foreground capitalize">
                  {patient?.gender}
                </td>
                <td className="px-4 py-4 text-sm text-foreground">
                  {formatDate(patient?.lastVisit)}
                </td>
                <td className="px-4 py-4">{getStatusBadge(patient?.status)}</td>
                <td className="px-4 py-4">
                  <div
                    className="flex gap-1"
                    onClick={(e) => e?.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPatient(patient?.id)}
                      iconName="Eye"
                      className="p-2"
                      title="View Patient"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCreateEncounter(patient?.id)}
                      iconName="Plus"
                      className="p-2"
                      title="New Encounter"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRequestConsent(patient?.id)}
                      iconName="FileText"
                      className="p-2"
                      title="Request Consent"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;

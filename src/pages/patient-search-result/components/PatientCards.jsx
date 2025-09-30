import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const PatientCards = ({
  patients,
  loading,
  onViewPatient,
  onCreateEncounter,
  onRequestConsent,
}) => {
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)]?.map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-28"></div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-8 bg-muted rounded flex-1"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {patients?.map((patient) => (
        <div
          key={patient?.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-lg transition-clinical cursor-pointer"
          onClick={() => onViewPatient(patient?.id)}
        >
          <div className="flex items-start gap-4 mb-4">
            <Image
              src={patient?.photo}
              alt={patient?.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-foreground truncate">
                    {patient?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {patient?.patientId}
                  </p>
                </div>
                {getStatusBadge(patient?.status)}
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Icon
                    name="Phone"
                    size={14}
                    className="text-muted-foreground"
                  />
                  <span className="text-foreground">{patient?.phone}</span>
                </div>

                {patient?.abhaId && (
                  <div className="flex items-center gap-2">
                    <Icon
                      name="CreditCard"
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-foreground">{patient?.abhaId}</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="Calendar"
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-foreground">
                      {patient?.age} years
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon
                      name="User"
                      size={14}
                      className="text-muted-foreground"
                    />
                    <span className="text-foreground capitalize">
                      {patient?.gender}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Icon
                    name="Clock"
                    size={14}
                    className="text-muted-foreground"
                  />
                  <span className="text-muted-foreground">
                    Last visit: {formatDate(patient?.lastVisit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2" onClick={(e) => e?.stopPropagation()}>
            <Button
              variant="default"
              size="sm"
              onClick={() => onViewPatient(patient?.id)}
              iconName="Eye"
              iconPosition="left"
              className="flex-1"
            >
              View Profile
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateEncounter(patient?.id)}
              iconName="Plus"
              className="px-3"
              title="New Encounter"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => onRequestConsent(patient?.id)}
              iconName="FileText"
              className="px-3"
              title="Request Consent"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientCards;

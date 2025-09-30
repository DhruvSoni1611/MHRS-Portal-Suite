import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "/src/components/ScrollToTop";
import ErrorBoundary from "/src/components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import PatientSearchResults from "./pages/patient-search-result";
import PatientEnrollmentWorkflow from "./pages/patient-enrollment-workflow";
import PHOAnalyticsDashboard from "./pages/pho-analytics-dashboard";
import PatientSummaryProfile from "./pages/patient-summary-profile";
import LoginAuthentication from "./pages/login-authentication";
import MultiPortalDashboard from "./pages/multi-portal-dashboard";
import ClinicalEncounterForm from "./pages/clinical-encounter-form";
import DigitalConsentManagement from "./pages/digital-consent-management";
import LabOrderManagement from "./pages/lab-order-management";
import { ProtectedRoute, RoleRoute } from "./utils/auth.jsx";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<LoginAuthentication />} />
          <Route
            path="/login-authentication"
            element={<LoginAuthentication />}
          />

          {/* Authenticated area */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/multi-portal-dashboard"
              element={<MultiPortalDashboard />}
            />

            {/* Clinic Staff only */}
            <Route element={<RoleRoute allowedRoles={["clinic-staff"]} />}>
              <Route
                path="/patient-search-results"
                element={<PatientSearchResults />}
              />
              <Route
                path="/patient-enrollment-workflow"
                element={<PatientEnrollmentWorkflow />}
              />
              <Route
                path="/clinical-encounter-form"
                element={<ClinicalEncounterForm />}
              />
              <Route
                path="/patient-summary-profile"
                element={<PatientSummaryProfile />}
              />
            </Route>

            {/* PHO Official only */}
            <Route element={<RoleRoute allowedRoles={["pho-official"]} />}>
              <Route
                path="/pho-analytics-dashboard"
                element={<PHOAnalyticsDashboard />}
              />
            </Route>

            {/* Lab Personnel only */}
            <Route element={<RoleRoute allowedRoles={["lab-personnel"]} />}>
              <Route
                path="/lab-order-management"
                element={<LabOrderManagement />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

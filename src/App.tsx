import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { TenantProvider, useTenant } from "./features/tenants";
import { AppShell, PublicLayout } from "./components/layout";
import { LoadingSpinner } from "./components/ui";
import { DashboardPage } from "./features/dashboard/routes";
import {
  EventListPage,
  EventFormPage,
  EventLandingPage,
} from "./features/events/routes";
import { AdminDashboardPage } from "./features/admin/routes";
import { SettingsPage } from "./features/settings/routes";
import { AuthProvider, useAuth, LoginPage } from "./features/auth";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.pathname + location.search + location.hash;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <>{children}</>;
}

function TenantGate({ children }: { children: ReactNode }) {
  const { loading, tenant } = useTenant();

  if (loading) return <LoadingSpinner />;

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-900">
            Tenant not found
          </h1>
          <p className="text-sm text-gray-500">
            We could not load this workspace. Please check the URL or contact
            your Eventudio administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function TenantRoutes() {
  return (
    <TenantGate>
      <Routes>
        {/* Client area */}
        <Route element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<DashboardPage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/new" element={<EventFormPage />} />
          <Route path="events/:eventId/edit" element={<EventFormPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Public event pages */}
        <Route path="e/:eventSlug" element={<PublicLayout />}>
          <Route index element={<EventLandingPage />} />
        </Route>
      </Routes>
    </TenantGate>
  );
}

function TenantSlugWrapper() {
  const { tenantSlug } = useParams();
  return (
    <TenantProvider slug={tenantSlug}>
      <TenantRoutes />
    </TenantProvider>
  );
}

function App() {
  return (
    <BrowserRouter basename="/live-events-dashboard">
      <AuthProvider>
        <Routes>
          {/* Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Tenant from URL path */}
          <Route
            path="/t/:tenantSlug/*"
            element={<TenantSlugWrapper />}
          />

          {/* Tenant from hostname (default) */}
          <Route
            path="/*"
            element={
              <TenantProvider>
                <TenantRoutes />
              </TenantProvider>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

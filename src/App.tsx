import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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

function TenantGate({ children }: { children: React.ReactNode }) {
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
            your ShowPro administrator.
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
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/new" element={<EventFormPage />} />
          <Route path="events/:eventId/edit" element={<EventFormPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
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
    <BrowserRouter>
      <Routes>
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
    </BrowserRouter>
  );
}

export default App;

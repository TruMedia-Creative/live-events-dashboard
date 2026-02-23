import { Link, Outlet } from "react-router-dom";
import { useTenant } from "../../features/tenants";

export function AppShell() {
  const { tenant } = useTenant();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {tenant?.branding.logoUrl ? (
                <img
                  src={tenant.branding.logoUrl}
                  alt={tenant.name}
                  className="h-8"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {tenant?.name ?? "ShowPro"}
                </span>
              )}
            </div>
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                to="/events"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Events
              </Link>
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

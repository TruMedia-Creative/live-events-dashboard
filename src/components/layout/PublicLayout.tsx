import { Outlet } from "react-router-dom";
import { useTenant } from "../../features/tenants";

export function PublicLayout() {
  const { tenant } = useTenant();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="mx-auto max-w-4xl px-4 text-center">
          {tenant?.branding.logoUrl ? (
            <img
              src={tenant.branding.logoUrl}
              alt={tenant.name}
              className="mx-auto h-10"
            />
          ) : (
            <span className="text-xl font-bold">
              {tenant?.name ?? "Event"}
            </span>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

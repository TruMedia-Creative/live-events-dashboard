import { useCallback, useEffect, useState } from "react";
import {
  getEvents,
  getTenants,
  updateEvent,
  deleteEvent,
} from "../../../lib/api/mock";
import { LoadingSpinner } from "../../../components/ui";
import type { EventData } from "../../events/model";
import type { Tenant } from "../../tenants/model";

const statusBadge: Record<EventData["status"], string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

export function AdminDashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const loadedTenants = await getTenants();
      const allEvents = (
        await Promise.all(loadedTenants.map((t) => getEvents(t.id)))
      ).flat();
      setTenants(loadedTenants);
      setEvents(allEvents);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePublish = useCallback(
    async (id: string) => {
      await updateEvent(id, { status: "published" });
      await loadData();
    },
    [loadData],
  );

  const handleArchive = useCallback(
    async (id: string) => {
      await updateEvent(id, { status: "archived" });
      await loadData();
    },
    [loadData],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this event?"))
        return;
      await deleteEvent(id);
      await loadData();
    },
    [loadData],
  );

  const tenantName = useCallback(
    (tenantId: string) =>
      tenants.find((t) => t.id === tenantId)?.name ?? tenantId,
    [tenants],
  );

  if (loading) return <LoadingSpinner />;

  const publishedCount = events.filter(
    (e) => e.status === "published",
  ).length;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Tenants</p>
          <p className="text-2xl font-semibold text-gray-900">
            {tenants.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-semibold text-gray-900">
            {events.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Published Events</p>
          <p className="text-2xl font-semibold text-gray-900">
            {publishedCount}
          </p>
        </div>
      </div>

      {/* Tenants */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Tenants</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Slug
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Domain
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Primary Color
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {t.name}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{t.slug}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {t.domain ?? "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-4 w-4 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: t.branding.primaryColor,
                        }}
                      />
                      <span className="text-gray-600">
                        {t.branding.primaryColor}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Events */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          All Events
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Tenant
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Start
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  End
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Venue
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {ev.title}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {tenantName(ev.tenantId)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[ev.status]}`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(ev.startAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(ev.endAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{ev.venue}</td>
                  <td className="space-x-2 px-4 py-2">
                    {ev.status === "draft" && (
                      <button
                        onClick={() => handlePublish(ev.id)}
                        className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Publish
                      </button>
                    )}
                    {ev.status === "published" && (
                      <button
                        onClick={() => handleArchive(ev.id)}
                        className="rounded bg-gray-500 px-2 py-1 text-xs font-medium text-white hover:bg-gray-600"
                      >
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

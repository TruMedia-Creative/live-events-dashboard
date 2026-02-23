import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTenant } from "../../tenants/context/TenantContext";
import { getEvents, deleteEvent } from "../../../lib/api/mock/events";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import type { EventData, EventStatus } from "../model/types";

const STATUS_STYLES: Record<EventStatus, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function EventListPage() {
  const { tenant, loading: tenantLoading } = useTenant();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    const data = await getEvents(tenant.id);
    setEvents(data);
    setLoading(false);
  }, [tenant]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    await loadEvents();
  };

  if (tenantLoading || loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <Link
          to="/events/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          No events found.{" "}
          <Link to="/events/new" className="text-indigo-600 hover:underline">
            Create your first event
          </Link>
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Venue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {event.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[event.status]}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {dateFormatter.format(new Date(event.startAt))}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {event.venue}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-3">
                      {event.status === "published" && (
                        <Link
                          to={`/e/${event.slug}`}
                          className="text-gray-400 hover:text-indigo-600"
                          title="View public page"
                        >
                          🔗
                        </Link>
                      )}
                      <Link
                        to={`/events/${event.id}/edit`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

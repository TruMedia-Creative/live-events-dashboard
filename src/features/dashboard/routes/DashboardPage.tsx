import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTenant } from "../../tenants/context/TenantContext";
import { getEvents } from "../../../lib/api/mock/events";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import type { EventData } from "../../events/model/types";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

export function DashboardPage() {
  const { tenant, loading: tenantLoading } = useTenant();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant) return;
    getEvents(tenant.id).then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, [tenant]);

  if (tenantLoading || loading) return <LoadingSpinner />;

  const published = events.filter((e) => e.status === "published").length;
  const drafts = events.filter((e) => e.status === "draft").length;
  const recent = events.slice(0, 3);

  const stats = [
    { label: "Total Events", value: events.length, color: "text-indigo-600" },
    { label: "Published", value: published, color: "text-green-600" },
    { label: "Drafts", value: drafts, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back, {tenant?.name ?? "Team"}
          </p>
        </div>
        <Link
          to="/events/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
        >
          + Create New Event
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Events
          </h2>
          <Link
            to="/events"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-gray-500">
            No events yet.{" "}
            <Link to="/events/new" className="text-indigo-600 hover:underline">
              Create your first event
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
            {recent.map((event) => (
              <li key={event.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <Link
                    to={`/events/${event.id}/edit`}
                    className="font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {event.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(event.startAt))}{" "}
                    · {event.venue}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[event.status] ?? ""}`}
                >
                  {event.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTenant } from "../../tenants";
import { getEvents } from "../../../lib/api";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "../../../components/ui";
import type { EventData } from "../../events/model/types";

const STATUS_VARIANTS: Record<string, "secondary" | "default" | "outline"> = {
  draft: "secondary",
  published: "default",
  archived: "outline",
};

export function DashboardPage() {
  const { tenant, loading: tenantLoading } = useTenant();
  const shouldReduceMotion = useReducedMotion();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!tenant) return;

    let cancelled = false;
    setHasError(false);

    const loadEvents = async () => {
      try {
        const data = await getEvents(tenant.id);
        if (cancelled) return;
        setEvents(data);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load dashboard events", error);
        setHasError(true);
        return;
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
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
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {tenant?.name ?? "Team"}
          </p>
        </div>
        <Button asChild>
          <Link to="/events/new">+ Create New Event</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s, index) => (
          <motion.div
            key={s.label}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * index }}
          >
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Events */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Events
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/events">View all →</Link>
          </Button>
        </div>

        {recent.length === 0 ? (
          hasError ? (
            <div role="alert" className="mt-4 flex items-center gap-2 text-destructive">
              <span aria-hidden="true">⚠️</span>
              <p>
                We couldn&apos;t load events right now. Please refresh and try
                again.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">
              No events yet.{" "}
              <Link to="/events/new" className="text-primary hover:underline">
                Create your first event
              </Link>
            </p>
          )
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border bg-card shadow-sm">
            {recent.map((event) => (
              <motion.li
                key={event.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <Link
                    to={`/events/${event.id}/edit`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {event.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(event.startAt))}{" "}
                    · {event.venue}
                  </p>
                </div>
                <Badge
                  variant={STATUS_VARIANTS[event.status] ?? "outline"}
                  className="capitalize"
                >
                  {event.status}
                </Badge>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

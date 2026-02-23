import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventBySlug } from "../../../lib/api/mock";
import { useTenant } from "../../tenants";
import type { EventData, StreamConfig, Speaker, EventResource, Session } from "../model";
import { LoadingSpinner } from "../../../components/ui";
import { isAllowedStreamUrl } from "../utils/streamUrl";

function formatEventDate(startAt: string, endAt: string, timezone: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  };
  const datePart = start.toLocaleDateString("en-US", dateOpts);
  const startTime = start.toLocaleTimeString("en-US", timeOpts);
  const endTime = end.toLocaleTimeString("en-US", timeOpts);
  return `${datePart} · ${startTime} – ${endTime}`;
}

function formatSessionTime(startAt: string, endAt: string, timezone: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  };
  const startTime = start.toLocaleTimeString("en-US", timeOpts);
  const endTime = end.toLocaleTimeString("en-US", timeOpts);
  return `${startTime} – ${endTime}`;
}

function StatusBadge({ isLive }: { isLive: boolean }) {
  if (!isLive) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
      <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
      LIVE
    </span>
  );
}

function StreamEmbed({ stream }: { stream: StreamConfig }) {
  if (stream.provider === "other") {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-gray-600">This event is streamed on an external platform.</p>
        <a
          href={stream.embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-medium text-indigo-600 hover:text-indigo-500"
        >
          Open stream ↗
        </a>
      </div>
    );
  }

  if (!isAllowedStreamUrl(stream.embedUrl)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Stream URL is not from an allowed provider.</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
      <iframe
        src={stream.embedUrl}
        title="Event stream"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
      {speaker.headshotUrl ? (
        <img
          src={speaker.headshotUrl}
          alt={speaker.name}
          className="mb-4 h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
          {speaker.name.charAt(0)}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900">{speaker.name}</h3>
      <p className="text-sm text-gray-600">
        {speaker.title}{speaker.company && `, ${speaker.company}`}
      </p>
      {speaker.bio && (
        <p className="mt-2 text-sm text-gray-500">{speaker.bio}</p>
      )}
    </div>
  );
}

function ResourceItem({ resource }: { resource: EventResource }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="font-medium text-gray-900">{resource.name}</p>
        <p className="text-sm text-gray-500">{resource.type}</p>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
      >
        Download
      </a>
    </li>
  );
}

function SessionItem({ session, timezone }: { session: Session; timezone: string }) {
  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="shrink-0 text-sm font-medium text-indigo-600">
        {formatSessionTime(session.startAt, session.endAt, timezone)}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900">{session.title}</h3>
        {session.speakerName && (
          <p className="text-sm text-gray-600">{session.speakerName}</p>
        )}
        {session.description && (
          <p className="mt-1 text-sm text-gray-500">{session.description}</p>
        )}
      </div>
    </div>
  );
}

export default function EventLandingPage() {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const { tenant, loading: tenantLoading } = useTenant();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (tenantLoading || !tenant || !eventSlug) return;

    let cancelled = false;

    getEventBySlug(tenant.id, eventSlug).then((data) => {
      if (cancelled) return;
      if (data) {
        setEvent(data);
        setNotFound(false);
      } else {
        setEvent(null);
        setNotFound(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [tenant, tenantLoading, eventSlug]);

  if (!eventSlug) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Event not found</h1>
          <p className="mt-2 text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (loading || tenantLoading) {
    return <LoadingSpinner />;
  }

  if (notFound || !event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Event not found</h1>
          <p className="mt-2 text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Event Banner */}
      {event.bannerUrl && (
        <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
          <img
            src={event.bannerUrl}
            alt={`${event.title} banner`}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Event Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {event.title}
          </h1>
          {event.stream?.isLive && <StatusBadge isLive />}
        </div>
        <div className="mt-3 space-y-1 text-gray-600">
          <p>{formatEventDate(event.startAt, event.endAt, event.timezone)}</p>
          <p>
            {event.venue ? `${event.venue} · ` : ""}{event.timezone}
          </p>
        </div>
      </header>

      {/* Stream Embed */}
      {event.stream && (
        <section className="mb-10">
          <StreamEmbed stream={event.stream} />
        </section>
      )}

      {/* Description */}
      {event.description && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">About this event</h2>
          <p className="whitespace-pre-line leading-relaxed text-gray-700">
            {event.description}
          </p>
        </section>
      )}

      {/* Sessions / Schedule */}
      {event.sessions?.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Schedule</h2>
          <div className="space-y-3">
            {event.sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                timezone={event.timezone}
              />
            ))}
          </div>
        </section>
      )}

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Speakers</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {event.speakers.map((speaker, index) => (
              <SpeakerCard key={`${speaker.name}-${index}`} speaker={speaker} />
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      {event.resources.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Resources</h2>
          <ul className="space-y-3">
            {event.resources.map((resource) => (
              <ResourceItem key={resource.id} resource={resource} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

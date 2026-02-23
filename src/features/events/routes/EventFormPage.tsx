import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTenant } from "../../tenants";
import {
  getEventById,
  createEvent,
  updateEvent,
} from "../../../lib/api/mock";
import { createEventSchema, type CreateEventInput } from "../model";
import type { EventData } from "../model";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HT)" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const DEFAULT_VALUES: CreateEventInput = {
  title: "",
  slug: "",
  status: "draft",
  startAt: "",
  endAt: "",
  timezone: "America/New_York",
  venue: "",
  description: "",
  resources: [],
  speakers: [],
};

export function EventFormPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const isEditing = Boolean(eventId);
  const navigate = useNavigate();
  const { tenant, loading: tenantLoading } = useTenant();

  const [loadingEvent, setLoadingEvent] = useState(isEditing);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({ defaultValues: DEFAULT_VALUES });

  // Load existing event for editing
  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    getEventById(eventId).then((event: EventData | undefined) => {
      if (cancelled) return;
      if (event) {
        reset({
          title: event.title,
          slug: event.slug,
          status: event.status,
          startAt: event.startAt,
          endAt: event.endAt,
          timezone: event.timezone,
          venue: event.venue,
          description: event.description,
          stream: event.stream,
          resources: event.resources,
          speakers: event.speakers,
        });
      }
      setLoadingEvent(false);
    });
    return () => {
      cancelled = true;
    };
  }, [eventId, reset]);

  // Auto-generate slug from title on create
  const title = watch("title");
  useEffect(() => {
    if (!isEditing) {
      setValue("slug", slugify(title ?? ""));
    }
  }, [title, isEditing, setValue]);

  const streamProvider = watch("stream.provider");

  const onSubmit = async (formData: CreateEventInput) => {
    setSubmitError(null);

    // Validate with Zod schema manually to handle zod/v4 compat
    const result = createEventSchema.safeParse(formData);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") as Parameters<typeof setError>[0];
        setError(path, { type: "manual", message: issue.message });
      }
      return;
    }

    try {
      if (isEditing && eventId) {
        await updateEvent(eventId, result.data);
      } else if (tenant) {
        await createEvent(tenant.id, result.data);
      }
      navigate("/events");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (tenantLoading || loadingEvent) {
    return <p className="p-6 text-gray-500">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link
        to="/events"
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back to Events
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        {isEditing ? "Edit Event" : "Create Event"}
      </h1>

      {submitError && (
        <p className="mt-2 text-sm text-red-600">{submitError}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-6"
        noValidate
      >
        {/* Title & Slug */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              {...register("slug")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Dates & Timezone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="startAt" className="block text-sm font-medium text-gray-700">
              Start Date/Time
            </label>
            <input
              id="startAt"
              type="datetime-local"
              {...register("startAt")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.startAt && (
              <p className="mt-1 text-sm text-red-600">{errors.startAt.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="endAt" className="block text-sm font-medium text-gray-700">
              End Date/Time
            </label>
            <input
              id="endAt"
              type="datetime-local"
              {...register("endAt")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.endAt && (
              <p className="mt-1 text-sm text-red-600">{errors.endAt.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
              id="timezone"
              {...register("timezone")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
            )}
          </div>
        </div>

        {/* Venue */}
        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
            Venue
          </label>
          <input
            id="venue"
            type="text"
            {...register("venue")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.venue && (
            <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Stream Configuration */}
        <fieldset className="rounded-md border border-gray-200 p-4">
          <legend className="px-2 text-sm font-medium text-gray-700">
            Stream (optional)
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="stream-provider" className="block text-sm font-medium text-gray-700">
                Provider
              </label>
              <select
                id="stream-provider"
                {...register("stream.provider")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">None</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="other">Other</option>
              </select>
            </div>
            {streamProvider && (
              <div>
                <label htmlFor="stream-embed-url" className="block text-sm font-medium text-gray-700">
                  Embed URL
                </label>
                <input
                  id="stream-embed-url"
                  type="url"
                  {...register("stream.embedUrl")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.stream?.embedUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.stream.embedUrl.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : isEditing
                ? "Update Event"
                : "Create Event"}
          </button>
          <Link
            to="/events"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

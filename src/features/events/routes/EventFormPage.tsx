import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
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
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Convert an ISO 8601 timestamp to `YYYY-MM-DDTHH:mm` for datetime-local inputs */
function toDatetimeLocal(iso: string): string {
  if (!iso) return "";
  // Strip the trailing "Z" or timezone offset and keep first 16 chars (YYYY-MM-DDTHH:mm)
  return iso.replace("Z", "").slice(0, 16);
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
  bannerUrl: "",
  resources: [],
  speakers: [],
  sessions: [],
};

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
const labelClass = "block text-sm font-medium text-gray-700";

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({ defaultValues: DEFAULT_VALUES });

  const {
    fields: speakerFields,
    append: appendSpeaker,
    remove: removeSpeaker,
  } = useFieldArray({ control, name: "speakers" });

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({ control, name: "resources" });

  const {
    fields: sessionFields,
    append: appendSession,
    remove: removeSession,
  } = useFieldArray({ control, name: "sessions" });

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
          startAt: toDatetimeLocal(event.startAt),
          endAt: toDatetimeLocal(event.endAt),
          timezone: event.timezone,
          venue: event.venue ?? "",
          description: event.description,
          bannerUrl: event.bannerUrl ?? "",
          stream: event.stream,
          resources: event.resources,
          speakers: event.speakers,
          sessions: event.sessions.map((s) => ({
            ...s,
            startAt: toDatetimeLocal(s.startAt),
            endAt: toDatetimeLocal(s.endAt),
          })),
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

    // Strip empty optional fields and stream config when provider is "None"
    const dataToValidate = {
      ...formData,
      venue: formData.venue || undefined,
      bannerUrl: formData.bannerUrl || undefined,
      stream: formData.stream?.provider ? formData.stream : undefined,
    };

    // Validate with Zod schema manually to handle zod/v4 compat
    const result = createEventSchema.safeParse(dataToValidate);
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
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className={inputClass}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug
            </label>
            <input
              id="slug"
              type="text"
              {...register("slug")}
              className={inputClass}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className={inputClass}
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
            <label htmlFor="startAt" className={labelClass}>
              Start Date/Time
            </label>
            <input
              id="startAt"
              type="datetime-local"
              {...register("startAt")}
              className={inputClass}
            />
            {errors.startAt && (
              <p className="mt-1 text-sm text-red-600">{errors.startAt.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="endAt" className={labelClass}>
              End Date/Time
            </label>
            <input
              id="endAt"
              type="datetime-local"
              {...register("endAt")}
              className={inputClass}
            />
            {errors.endAt && (
              <p className="mt-1 text-sm text-red-600">{errors.endAt.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="timezone" className={labelClass}>
              Timezone
            </label>
            <select
              id="timezone"
              {...register("timezone")}
              className={inputClass}
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

        {/* Venue (optional) */}
        <div>
          <label htmlFor="venue" className={labelClass}>
            Venue <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="venue"
            type="text"
            placeholder="e.g. Javits Center, New York, NY"
            {...register("venue")}
            className={inputClass}
          />
          {errors.venue && (
            <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className={inputClass}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Banner URL */}
        <div>
          <label htmlFor="bannerUrl" className={labelClass}>
            Event Banner URL <span className="text-gray-400">(optional — jpeg, png, etc.)</span>
          </label>
          <input
            id="bannerUrl"
            type="url"
            placeholder="https://example.com/banner.jpg"
            {...register("bannerUrl")}
            className={inputClass}
          />
          {errors.bannerUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.bannerUrl.message}</p>
          )}
        </div>

        {/* Stream Configuration */}
        <fieldset className="rounded-md border border-gray-200 p-4">
          <legend className="px-2 text-sm font-medium text-gray-700">
            Stream (optional)
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="stream-provider" className={labelClass}>
                Provider
              </label>
              <select
                id="stream-provider"
                {...register("stream.provider")}
                className={inputClass}
              >
                <option value="">None</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="other">Other</option>
              </select>
            </div>
            {streamProvider && (
              <div>
                <label htmlFor="stream-embed-url" className={labelClass}>
                  Embed URL
                </label>
                <input
                  id="stream-embed-url"
                  type="url"
                  {...register("stream.embedUrl")}
                  className={inputClass}
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

        {/* Speakers */}
        <fieldset className="rounded-md border border-gray-200 p-4">
          <legend className="px-2 text-sm font-medium text-gray-700">
            Keynote Speakers
          </legend>
          <div className="space-y-4">
            {speakerFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-md border border-gray-100 bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Speaker {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      {...register(`speakers.${index}.name`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Title / Role</label>
                    <input
                      type="text"
                      {...register(`speakers.${index}.title`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      type="text"
                      {...register(`speakers.${index}.company`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Photo URL <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      {...register(`speakers.${index}.headshotUrl`)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelClass}>
                    Bio <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register(`speakers.${index}.bio`)}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendSpeaker({ name: "", title: "", company: "", headshotUrl: "", bio: "" })
              }
              className="rounded-md border border-dashed border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Add Speaker
            </button>
          </div>
        </fieldset>

        {/* Resources / Supporting Files */}
        <fieldset className="rounded-md border border-gray-200 p-4">
          <legend className="px-2 text-sm font-medium text-gray-700">
            Supporting Files &amp; Resources
          </legend>
          <div className="space-y-4">
            {resourceFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-md border border-gray-100 bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Resource {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Slide Deck"
                      {...register(`resources.${index}.name`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>File URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/slides.pdf"
                      {...register(`resources.${index}.url`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <select
                      {...register(`resources.${index}.type`)}
                      className={inputClass}
                    >
                      <option value="pdf">PDF</option>
                      <option value="presentation">Presentation</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <input type="hidden" {...register(`resources.${index}.id`)} />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendResource({ id: crypto.randomUUID(), name: "", url: "", type: "pdf" })
              }
              className="rounded-md border border-dashed border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Add Resource
            </button>
          </div>
        </fieldset>

        {/* Sessions */}
        <fieldset className="rounded-md border border-gray-200 p-4">
          <legend className="px-2 text-sm font-medium text-gray-700">
            Sessions / Schedule
          </legend>
          <div className="space-y-4">
            {sessionFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-md border border-gray-100 bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Session {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSession(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Session Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Opening Keynote"
                      {...register(`sessions.${index}.title`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Start Time</label>
                    <input
                      type="datetime-local"
                      {...register(`sessions.${index}.startAt`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Time</label>
                    <input
                      type="datetime-local"
                      {...register(`sessions.${index}.endAt`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Speaker <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Speaker name"
                      {...register(`sessions.${index}.speakerName`)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Description <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Brief session description"
                      {...register(`sessions.${index}.description`)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <input type="hidden" {...register(`sessions.${index}.id`)} />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendSession({
                  id: crypto.randomUUID(),
                  title: "",
                  startAt: "",
                  endAt: "",
                  description: "",
                  speakerName: "",
                })
              }
              className="rounded-md border border-dashed border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Add Session
            </button>
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

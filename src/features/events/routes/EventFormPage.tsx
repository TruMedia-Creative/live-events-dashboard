import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useTenant } from "../../tenants";
import {
  getEventById,
  createEvent,
  updateEvent,
} from "../../../lib/api/mock";
import { createEventSchema, type CreateEventInput } from "../model";
import type { EventData } from "../model";
import type { AppShellOutletContext } from "../../../components/layout/AppShell";
import { BannerUpload } from "../../../components/ui";

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

export function EventFormPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const isEditing = Boolean(eventId);
  const navigate = useNavigate();
  const { tenant, loading: tenantLoading } = useTenant();
  const { theme } = useOutletContext<AppShellOutletContext>();
  const isDark = theme === "dark";

  const baseInputClass =
    "mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
  const labelClass = `block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`;
  const fieldInputClass = `${baseInputClass} ${isDark ? "border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-500" : "border-gray-300 bg-white text-gray-900"}`;
  const fieldsetClass = `rounded-md border p-4 ${isDark ? "border-gray-700" : "border-gray-200"}`;
  const legendClass = `px-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`;
  const subItemClass = `rounded-md border p-4 ${isDark ? "border-gray-600 bg-gray-700/50" : "border-gray-100 bg-gray-50"}`;
  const subItemLabelClass = `text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`;

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
      speakers: formData.speakers.map((s) => ({
        ...s,
        headshotUrl: s.headshotUrl || undefined,
        bio: s.bio || undefined,
      })),
      sessions: formData.sessions.map((s) => ({
        ...s,
        description: s.description || undefined,
        speakerName: s.speakerName || undefined,
      })),
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
    return <p className={`p-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link
        to="/events"
        className="text-sm text-indigo-400 hover:underline"
      >
        ← Back to Events
      </Link>

      <h1 className={`mt-4 text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
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
              className={fieldInputClass}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
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
              className={fieldInputClass}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
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
            className={fieldInputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
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
              className={fieldInputClass}
            />
            {errors.startAt && (
              <p className="mt-1 text-sm text-red-500">{errors.startAt.message}</p>
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
              className={fieldInputClass}
            />
            {errors.endAt && (
              <p className="mt-1 text-sm text-red-500">{errors.endAt.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="timezone" className={labelClass}>
              Timezone
            </label>
            <select
              id="timezone"
              {...register("timezone")}
              className={fieldInputClass}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="mt-1 text-sm text-red-500">{errors.timezone.message}</p>
            )}
          </div>
        </div>

        {/* Venue (optional) */}
        <div>
          <label htmlFor="venue" className={labelClass}>
            Venue <span className={isDark ? "text-gray-500" : "text-gray-400"}>(optional)</span>
          </label>
          <input
            id="venue"
            type="text"
            placeholder="e.g. Javits Center, New York, NY"
            {...register("venue")}
            className={fieldInputClass}
          />
          {errors.venue && (
            <p className="mt-1 text-sm text-red-500">{errors.venue.message}</p>
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
            className={fieldInputClass}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Event Banner */}
        <div>
          <label className={labelClass}>
            Event Banner{" "}
            <span className={isDark ? "text-gray-500" : "text-gray-400"}>
              (optional — upload from your machine)
            </span>
          </label>
          <div className="mt-1">
            <BannerUpload
              value={watch("bannerUrl") || undefined}
              onChange={(val) => setValue("bannerUrl", val ?? "")}
              isDark={isDark}
            />
          </div>
          {errors.bannerUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.bannerUrl.message}</p>
          )}
        </div>

        {/* Stream Configuration */}
        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
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
                className={fieldInputClass}
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
                  className={fieldInputClass}
                />
                {errors.stream?.embedUrl && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.stream.embedUrl.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </fieldset>

        {/* Speakers */}
        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
            Keynote Speakers
          </legend>
          <div className="space-y-4">
            {speakerFields.map((field, index) => (
              <div
                key={field.id}
                className={subItemClass}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={subItemLabelClass}>
                    Speaker {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="text-sm text-red-500 hover:text-red-400"
                    aria-label={`Remove speaker ${index + 1}`}
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
                      className={fieldInputClass}
                    />
                    {errors.speakers?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.speakers[index].name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Title / Role</label>
                    <input
                      type="text"
                      {...register(`speakers.${index}.title`)}
                      className={fieldInputClass}
                    />
                    {errors.speakers?.[index]?.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.speakers[index].title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      type="text"
                      {...register(`speakers.${index}.company`)}
                      className={fieldInputClass}
                    />
                    {errors.speakers?.[index]?.company && (
                      <p className="mt-1 text-sm text-red-500">{errors.speakers[index].company.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      Photo URL <span className={isDark ? "text-gray-500" : "text-gray-400"}>(optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      {...register(`speakers.${index}.headshotUrl`)}
                      className={fieldInputClass}
                    />
                    {errors.speakers?.[index]?.headshotUrl && (
                      <p className="mt-1 text-sm text-red-500">{errors.speakers[index].headshotUrl.message}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelClass}>
                    Bio <span className={isDark ? "text-gray-500" : "text-gray-400"}>(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register(`speakers.${index}.bio`)}
                    className={fieldInputClass}
                  />
                </div>
                <input type="hidden" {...register(`speakers.${index}.id`)} />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendSpeaker({
                  id: crypto.randomUUID(),
                  name: "",
                  title: "",
                  company: "",
                  headshotUrl: "",
                  bio: "",
                })
              }
              className={`rounded-md border border-dashed px-4 py-2 text-sm font-medium text-indigo-400 ${isDark ? "border-indigo-700 hover:bg-indigo-900/30" : "border-indigo-300 hover:bg-indigo-50"}`}
            >
              + Add Speaker
            </button>
          </div>
        </fieldset>

        {/* Resources / Supporting Files */}
        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
            Supporting Files &amp; Resources
          </legend>
          <div className="space-y-4">
            {resourceFields.map((field, index) => (
              <div
                key={field.id}
                className={subItemClass}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={subItemLabelClass}>
                    Resource {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-sm text-red-500 hover:text-red-400"
                    aria-label={`Remove resource ${index + 1}`}
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
                      className={fieldInputClass}
                    />
                    {errors.resources?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.resources[index].name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>File URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/slides.pdf"
                      {...register(`resources.${index}.url`)}
                      className={fieldInputClass}
                    />
                    {errors.resources?.[index]?.url && (
                      <p className="mt-1 text-sm text-red-500">{errors.resources[index].url.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <select
                      {...register(`resources.${index}.type`)}
                      className={fieldInputClass}
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
              className={`rounded-md border border-dashed px-4 py-2 text-sm font-medium text-indigo-400 ${isDark ? "border-indigo-700 hover:bg-indigo-900/30" : "border-indigo-300 hover:bg-indigo-50"}`}
            >
              + Add Resource
            </button>
          </div>
        </fieldset>

        {/* Sessions */}
        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>
            Sessions / Schedule
          </legend>
          <div className="space-y-4">
            {sessionFields.map((field, index) => (
              <div
                key={field.id}
                className={subItemClass}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={subItemLabelClass}>
                    Session {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSession(index)}
                    className="text-sm text-red-500 hover:text-red-400"
                    aria-label={`Remove session ${index + 1}`}
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
                      className={fieldInputClass}
                    />
                    {errors.sessions?.[index]?.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.sessions[index].title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Start Time</label>
                    <input
                      type="datetime-local"
                      {...register(`sessions.${index}.startAt`)}
                      className={fieldInputClass}
                    />
                    {errors.sessions?.[index]?.startAt && (
                      <p className="mt-1 text-sm text-red-500">{errors.sessions[index].startAt.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>End Time</label>
                    <input
                      type="datetime-local"
                      {...register(`sessions.${index}.endAt`)}
                      className={fieldInputClass}
                    />
                    {errors.sessions?.[index]?.endAt && (
                      <p className="mt-1 text-sm text-red-500">{errors.sessions[index].endAt.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      Speaker <span className={isDark ? "text-gray-500" : "text-gray-400"}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Speaker name"
                      {...register(`sessions.${index}.speakerName`)}
                      className={fieldInputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Description <span className={isDark ? "text-gray-500" : "text-gray-400"}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Brief session description"
                      {...register(`sessions.${index}.description`)}
                      className={fieldInputClass}
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
              className={`rounded-md border border-dashed px-4 py-2 text-sm font-medium text-indigo-400 ${isDark ? "border-indigo-700 hover:bg-indigo-900/30" : "border-indigo-300 hover:bg-indigo-50"}`}
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
            className={`text-sm ${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

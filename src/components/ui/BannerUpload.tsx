import { useRef, useState } from "react";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

interface BannerUploadProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  isDark?: boolean;
}

/**
 * Drag-and-drop image uploader for the event banner.
 * Accepts image files from the local machine and stores them as base64
 * data URLs (held in localStorage alongside the rest of the event data).
 * Also accepts any existing HTTPS banner URL as a preview.
 */
export function BannerUpload({
  value,
  onChange,
  isDark = false,
}: BannerUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setFileError(null);
    if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
      setFileError("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError("Image must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  }

  const dropzoneBase =
    "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors";
  const dropzoneColors = isDragging
    ? isDark
      ? "border-indigo-500 bg-indigo-900/20"
      : "border-indigo-500 bg-indigo-50"
    : isDark
      ? "border-gray-600 hover:border-indigo-500"
      : "border-gray-300 hover:border-indigo-400";

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative overflow-hidden rounded-md">
          <img
            src={value}
            alt="Event banner preview"
            className="h-40 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
            aria-label="Remove banner"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          className={`${dropzoneBase} ${dropzoneColors}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Upload event banner image"
        >
          <svg
            className={`mb-3 h-10 w-10 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <p
            className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Drag &amp; drop or click to upload
          </p>
          <p
            className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            JPEG, PNG, WebP, GIF · max 2 MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {fileError && <p className="text-sm text-red-500">{fileError}</p>}
    </div>
  );
}

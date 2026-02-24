const ALLOWED_STREAM_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "player.vimeo.com",
  "vimeo.com",
];

export function isAllowedStreamUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return false;
    }
    return ALLOWED_STREAM_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function isHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/** Matches only safe, base64-encoded image data URLs for supported formats. */
const SAFE_DATA_IMAGE_RE =
  /^data:image\/(jpeg|png|gif|webp);base64,[A-Za-z0-9+/]+=*$/;

/**
 * Returns true for valid banner URLs: either an HTTPS URL or a well-formed
 * base64-encoded image data URL produced by the local image uploader.
 */
export function isValidBannerUrl(url: string): boolean {
  if (SAFE_DATA_IMAGE_RE.test(url)) return true;
  return isHttpsUrl(url);
}

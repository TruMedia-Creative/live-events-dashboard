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
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    return ALLOWED_STREAM_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export type EventStatus = "draft" | "published" | "archived";
export type StreamProvider = "youtube" | "vimeo" | "other";

export interface StreamConfig {
  provider: StreamProvider;
  embedUrl: string;
  isLive?: boolean;
  replayUrl?: string;
}

export interface EventResource {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Speaker {
  name: string;
  title: string;
  company: string;
  headshotUrl?: string;
  bio?: string;
}

export interface EventData {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  status: EventStatus;
  startAt: string;
  endAt: string;
  timezone: string;
  venue: string;
  description: string;
  stream?: StreamConfig;
  resources: EventResource[];
  speakers: Speaker[];
}

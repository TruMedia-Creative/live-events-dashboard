import type { Tenant } from "../../../features/tenants/model";
import type { EventData } from "../../../features/events/model";

export const mockTenants: Tenant[] = [
  {
    id: "t-1",
    slug: "showpro",
    name: "ShowPro Productions",
    domain: "showpro.live",
    branding: {
      logoUrl: "https://placehold.co/200x60?text=ShowPro",
      primaryColor: "#4F46E5",
      fontFamily: "Inter",
    },
  },
  {
    id: "t-2",
    slug: "brightlights",
    name: "Bright Lights AV",
    branding: {
      logoUrl: "https://placehold.co/200x60?text=BrightLights",
      primaryColor: "#DC2626",
      fontFamily: "Roboto",
    },
  },
];

export const mockEvents: EventData[] = [
  {
    id: "e-1",
    tenantId: "t-1",
    title: "ShowPro Annual Conference 2025",
    slug: "annual-conference-2025",
    status: "published",
    startAt: "2025-09-15T09:00:00Z",
    endAt: "2025-09-15T17:00:00Z",
    timezone: "America/New_York",
    venue: "Javits Center, New York, NY",
    description:
      "Join us for a full day of keynotes, panels, and live demos showcasing the future of live event production.",
    bannerUrl: "https://placehold.co/1200x400?text=ShowPro+Annual+Conference+2025",
    stream: {
      provider: "youtube",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isLive: false,
    },
    resources: [
      {
        id: "r-1",
        name: "Event Program",
        url: "https://example.com/program.pdf",
        type: "pdf",
      },
      {
        id: "r-2",
        name: "Speaker Slide Deck",
        url: "https://example.com/slides.pptx",
        type: "presentation",
      },
    ],
    speakers: [
      {
        id: "sp-1",
        name: "Alex Rivera",
        title: "CEO",
        company: "ShowPro Productions",
        headshotUrl: "https://placehold.co/150x150?text=AR",
        bio: "Pioneer in hybrid event technology with 15 years of experience in AV production.",
      },
      {
        id: "sp-2",
        name: "Jordan Lee",
        title: "Director of Engineering",
        company: "StreamCore",
        headshotUrl: "https://placehold.co/150x150?text=JL",
        bio: "Specialist in low-latency streaming infrastructure for live events.",
      },
    ],
    sessions: [
      {
        id: "s-1",
        title: "Opening Keynote: The Future of Live Events",
        startAt: "2025-09-15T09:00:00Z",
        endAt: "2025-09-15T10:00:00Z",
        description: "Alex Rivera shares the vision for the next decade of live event production.",
        speakerName: "Alex Rivera",
      },
      {
        id: "s-2",
        title: "Low-Latency Streaming Deep Dive",
        startAt: "2025-09-15T10:30:00Z",
        endAt: "2025-09-15T12:00:00Z",
        description: "Technical session on building reliable streaming infrastructure.",
        speakerName: "Jordan Lee",
      },
      {
        id: "s-3",
        title: "Panel: Hybrid Events Best Practices",
        startAt: "2025-09-15T13:00:00Z",
        endAt: "2025-09-15T14:30:00Z",
        description: "Industry experts discuss strategies for engaging both in-person and remote audiences.",
      },
    ],
  },
  {
    id: "e-2",
    tenantId: "t-1",
    title: "Behind the Scenes: Hybrid Production Workshop",
    slug: "hybrid-production-workshop",
    status: "draft",
    startAt: "2025-11-02T13:00:00Z",
    endAt: "2025-11-02T16:00:00Z",
    timezone: "America/Chicago",
    venue: "ShowPro Studio, Austin, TX",
    description:
      "A hands-on workshop covering multi-camera switching, virtual backgrounds, and audience engagement tools.",
    resources: [
      {
        id: "r-3",
        name: "Workshop Prerequisites",
        url: "https://example.com/prerequisites.pdf",
        type: "pdf",
      },
    ],
    speakers: [
      {
        id: "sp-3",
        name: "Morgan Chen",
        title: "Lead Technical Director",
        company: "ShowPro Productions",
        bio: "Award-winning TD known for flawless live-switched broadcasts.",
      },
    ],
    sessions: [
      {
        id: "s-4",
        title: "Multi-Camera Switching Basics",
        startAt: "2025-11-02T13:00:00Z",
        endAt: "2025-11-02T14:00:00Z",
        description: "Learn the fundamentals of live multi-camera production.",
        speakerName: "Morgan Chen",
      },
      {
        id: "s-5",
        title: "Hands-on Lab: Virtual Backgrounds",
        startAt: "2025-11-02T14:15:00Z",
        endAt: "2025-11-02T16:00:00Z",
        description: "Practice setting up and using virtual backgrounds in live broadcasts.",
      },
    ],
  },
  {
    id: "e-3",
    tenantId: "t-2",
    title: "Bright Lights Music Festival – Live Stream",
    slug: "music-festival-livestream",
    status: "published",
    startAt: "2025-08-20T18:00:00Z",
    endAt: "2025-08-20T23:00:00Z",
    timezone: "America/Los_Angeles",
    venue: "Griffith Park Amphitheatre, Los Angeles, CA",
    description:
      "Watch the Bright Lights Music Festival live from LA, featuring performances from top indie artists.",
    bannerUrl: "https://placehold.co/1200x400?text=Bright+Lights+Music+Festival",
    stream: {
      provider: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123456789",
      isLive: true,
    },
    resources: [
      {
        id: "r-4",
        name: "Artist Lineup",
        url: "https://example.com/lineup.pdf",
        type: "pdf",
      },
      {
        id: "r-5",
        name: "Festival Map",
        url: "https://example.com/map.png",
        type: "image",
      },
    ],
    speakers: [
      {
        id: "sp-4",
        name: "Priya Kapoor",
        title: "Festival Director",
        company: "Bright Lights AV",
        headshotUrl: "https://placehold.co/150x150?text=PK",
        bio: "Curator of immersive festival experiences blending live music and visual art.",
      },
      {
        id: "sp-5",
        name: "Sam Ortiz",
        title: "Audio Engineer",
        company: "Bright Lights AV",
        headshotUrl: "https://placehold.co/150x150?text=SO",
      },
    ],
    sessions: [
      {
        id: "s-6",
        title: "Opening Set: Indie Vibes",
        startAt: "2025-08-20T18:00:00Z",
        endAt: "2025-08-20T19:30:00Z",
        description: "Kick off the festival with emerging indie artists.",
      },
      {
        id: "s-7",
        title: "Headliner Performance",
        startAt: "2025-08-20T20:00:00Z",
        endAt: "2025-08-20T22:00:00Z",
        description: "The main headliner takes the stage for a two-hour set.",
      },
      {
        id: "s-8",
        title: "Closing DJ Set",
        startAt: "2025-08-20T22:00:00Z",
        endAt: "2025-08-20T23:00:00Z",
        description: "Close out the night with an electrifying DJ set.",
      },
    ],
  },
  {
    id: "e-4",
    tenantId: "t-2",
    title: "Corporate AV Solutions Webinar",
    slug: "corporate-av-webinar",
    status: "archived",
    startAt: "2025-03-10T11:00:00Z",
    endAt: "2025-03-10T12:00:00Z",
    timezone: "America/New_York",
    venue: "Online",
    description:
      "Recorded webinar covering end-to-end AV solutions for corporate town halls and all-hands meetings.",
    stream: {
      provider: "youtube",
      embedUrl: "https://www.youtube.com/embed/abc123xyz",
      isLive: false,
      replayUrl: "https://www.youtube.com/watch?v=abc123xyz",
    },
    resources: [
      {
        id: "r-6",
        name: "Webinar Recording",
        url: "https://example.com/recording.mp4",
        type: "video",
      },
      {
        id: "r-7",
        name: "Product Brochure",
        url: "https://example.com/brochure.pdf",
        type: "pdf",
      },
    ],
    speakers: [
      {
        id: "sp-6",
        name: "Taylor Nguyen",
        title: "VP of Sales",
        company: "Bright Lights AV",
        headshotUrl: "https://placehold.co/150x150?text=TN",
        bio: "Helping enterprises transform their internal communications with professional AV production.",
      },
    ],
    sessions: [
      {
        id: "s-9",
        title: "AV Solutions Overview",
        startAt: "2025-03-10T11:00:00Z",
        endAt: "2025-03-10T11:40:00Z",
        description: "End-to-end AV solutions for corporate communications.",
        speakerName: "Taylor Nguyen",
      },
      {
        id: "s-10",
        title: "Q&A Session",
        startAt: "2025-03-10T11:40:00Z",
        endAt: "2025-03-10T12:00:00Z",
        description: "Open Q&A with the audience.",
      },
    ],
  },
];

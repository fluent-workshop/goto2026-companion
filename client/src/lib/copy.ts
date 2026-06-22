import type { ConferenceDay } from "./types";

export const CONFERENCE = {
  name: "Accelerate Chicago",
  brand: "goto;",
  year: "2026",
  dates: "June 22 – 24, 2026",
  venue: "Convene Willis Tower",
  city: "Chicago, IL",
  tagline: "Accelerate Chicago",
  subhead:
    "Three days of deep technical talks on AI engineering, software architecture, and the craft of building software — from the people doing it in production.",
  registerUrl: "https://gotochgo.com/accelerate-chicago-2026/cart",
} as const;

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Speakers", to: "/speakers" },
  { label: "Schedule", to: "/schedule" },
] as const;

export const DAYS: ConferenceDay[] = [
  { date: "2026-06-22", weekday: "Monday", label: "Jun 22 · Masterclass Day" },
  { date: "2026-06-23", weekday: "Tuesday", label: "Jun 23 · Conference Day" },
  { date: "2026-06-24", weekday: "Wednesday", label: "Jun 24 · Conference Day" },
];

export const SPONSORS = [
  "Slalom",
  "Eidra",
  "P33",
  "Trifork",
  "Spantree",
] as const;

export const FOOTER_TEXT =
  "GOTO Accelerate Chicago 2026 — a companion experience. Built with React, Vite & Supabase.";

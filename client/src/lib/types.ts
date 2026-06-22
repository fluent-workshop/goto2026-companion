export interface Speaker {
  id: string; // slug, e.g. "scott-hanselman"
  name: string;
  title: string | null;
  company: string | null;
  tags: string[] | null;
  speaker_page_id: number | null;
  bio: string | null;
  portrait_url: string | null;
  profile_url: string | null;
}

export interface Session {
  id: string;
  title: string;
  type: string | null;
  date: string; // YYYY-MM-DD
  day: string | null;
  start_time: string | null; // HH:MM
  end_time: string | null; // HH:MM
  room: string | null;
  speaker_ids: string[] | null;
  tags: string[] | null;
  abstract: string | null;
  details_url: string | null;
  description: string | null; // full HTML
}

export interface ConferenceDay {
  date: string;
  weekday: string;
  label: string;
}

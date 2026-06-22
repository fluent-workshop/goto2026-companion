import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Session, Speaker } from "./types";

export async function fetchSpeakers(): Promise<Speaker[]> {
  const { data, error } = await supabase
    .from("speakers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSpeaker(id: string): Promise<Speaker | null> {
  const { data, error } = await supabase
    .from("speakers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchSessions(date?: string): Promise<Session[]> {
  let query = supabase.from("sessions").select("*");
  if (date) query = query.eq("date", date);
  const { data, error } = await query.order("start_time");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSessionByDetailsUrl(
  detailsUrl: string,
): Promise<Session | null> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("details_url", detailsUrl)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchSpeakersByIds(ids: string[]): Promise<Speaker[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("speakers")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return data ?? [];
}

export async function fetchSessionsBySpeaker(
  speakerId: string,
): Promise<Session[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .contains("speaker_ids", [speakerId])
    .order("date")
    .order("start_time");
  if (error) throw error;
  return data ?? [];
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/** Tiny async hook — runs `fn` whenever any of `deps` change. */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: null });
    fn()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (active) setState({ data: null, loading: false, error });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

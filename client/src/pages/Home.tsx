import { Link } from "react-router-dom";
import SpeakerCard from "@/components/SpeakerCard";
import TypeBadge from "@/components/TypeBadge";
import { fetchSessions, fetchSpeakers, useAsync } from "@/lib/data";
import { CONFERENCE, DAYS, SPONSORS } from "@/lib/copy";
import { formatDate, formatTime, sessionPath } from "@/lib/format";

export default function Home() {
  const { data: speakers } = useAsync(fetchSpeakers, []);
  const { data: sessions } = useAsync(() => fetchSessions(), []);

  const previewSpeakers = (speakers ?? []).slice(0, 9);
  const previewSessions = (sessions ?? [])
    .filter((s) => s.abstract)
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-deep to-navy-light opacity-95" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-magenta">
            {CONFERENCE.brand} presents
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            {CONFERENCE.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            {CONFERENCE.subhead}
          </p>

          <div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-magenta px-5 py-3 text-sm font-bold sm:text-base">
            <span>{CONFERENCE.dates}</span>
            <span className="opacity-60">·</span>
            <span>{CONFERENCE.venue}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CONFERENCE.registerUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:bg-white/90"
            >
              Register today
            </a>
            <Link
              to="/schedule"
              className="rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Speakers preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy">
              In good company
            </h2>
            <p className="mt-2 text-navy/60">
              A few of the {speakers?.length ?? "32"} speakers joining us.
            </p>
          </div>
          <Link
            to="/speakers"
            className="hidden text-sm font-semibold text-magenta hover:underline sm:block"
          >
            All speakers →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewSpeakers.map((s) => (
            <SpeakerCard key={s.id} speaker={s} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/speakers"
            className="text-sm font-semibold text-magenta hover:underline"
          >
            All speakers →
          </Link>
        </div>
      </section>

      {/* Schedule preview */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-navy">
                What's on
              </h2>
              <p className="mt-2 text-navy/60">
                Three days, two tracks of masterclasses & talks.
              </p>
            </div>
            <Link
              to="/schedule"
              className="hidden text-sm font-semibold text-magenta hover:underline sm:block"
            >
              Full schedule →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {previewSessions.map((s) => (
              <Link
                key={s.id}
                to={sessionPath(s)}
                className="block rounded-xl border border-black/5 bg-mist/50 p-5 transition hover:border-magenta/30 hover:bg-white"
              >
                <div className="flex items-center gap-2">
                  <TypeBadge type={s.type} />
                  <span className="text-xs text-navy/50">
                    {formatDate(s.date)} · {formatTime(s.start_time)}
                  </span>
                </div>
                <h3 className="mt-2 font-bold text-navy">{s.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight">The venue</h2>
          <p className="mt-3 max-w-2xl text-white/75">
            {CONFERENCE.venue} — in the heart of downtown {CONFERENCE.city}.
            Hands-on masterclasses, two talk tracks, and the hallway
            conversations that make GOTO what it is.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {DAYS.map((d) => (
              <div
                key={d.date}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <div className="text-sm font-semibold text-magenta">
                  {d.weekday}
                </div>
                <div className="mt-1 text-lg font-bold">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-navy-deep text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-bold">Become a sponsor</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
            Reach the engineers and architects building the next generation of
            software.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-bold text-white/50">
            {SPONSORS.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

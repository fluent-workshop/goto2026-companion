import { Link } from "react-router-dom";
import { CONFERENCE, FOOTER_TEXT, NAV_LINKS } from "@/lib/copy";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-extrabold text-magenta">
              {CONFERENCE.brand}
            </div>
            <p className="mt-2 max-w-sm text-sm">
              {CONFERENCE.name} {CONFERENCE.year} · {CONFERENCE.dates}
              <br />
              {CONFERENCE.venue}, {CONFERENCE.city}
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          {FOOTER_TEXT}
        </div>
      </div>
    </footer>
  );
}

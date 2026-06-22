import { Link, NavLink } from "react-router-dom";
import { CONFERENCE, NAV_LINKS } from "@/lib/copy";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-navy-deep/95 backdrop-blur border-b border-white/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-magenta">
            {CONFERENCE.brand}
          </span>
          <span className="hidden text-sm font-medium text-white/70 sm:inline">
            Accelerate Chicago {CONFERENCE.year}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href={CONFERENCE.registerUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-1 rounded-md bg-magenta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-magenta-dark"
          >
            Register
          </a>
        </div>
      </nav>
    </header>
  );
}

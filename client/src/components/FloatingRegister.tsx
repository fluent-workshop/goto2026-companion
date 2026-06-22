import { CONFERENCE } from "@/lib/copy";

/**
 * Persistent floating "Register today" CTA (bottom-right), mirroring the live
 * gotochgo.com site. Links to the registration cart, opens in a new tab.
 */
export default function FloatingRegister() {
  return (
    <a
      href={CONFERENCE.registerUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-magenta px-6 py-3 text-sm font-bold text-white shadow-lg shadow-magenta/30 transition hover:bg-magenta-dark hover:shadow-xl"
    >
      Register today
    </a>
  );
}

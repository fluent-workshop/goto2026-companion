import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-magenta">404</p>
      <h1 className="mt-4 text-2xl font-bold text-navy">Page not found</h1>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
      >
        Back home
      </Link>
    </div>
  );
}

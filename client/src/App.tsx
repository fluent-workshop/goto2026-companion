import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Speakers from "@/pages/Speakers";
import SpeakerDetail from "@/pages/SpeakerDetail";
import Schedule from "@/pages/Schedule";
import SessionDetail from "@/pages/SessionDetail";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/speakers/:id" element={<SpeakerDetail />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route
          path="/accelerate-chicago-2026/masterclasses/:id/:slug?"
          element={<SessionDetail kind="masterclasses" />}
        />
        <Route
          path="/accelerate-chicago-2026/sessions/:id/:slug?"
          element={<SessionDetail kind="sessions" />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

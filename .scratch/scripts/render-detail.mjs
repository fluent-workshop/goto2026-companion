import { chromium } from "playwright";

const BASE = "http://localhost:5173";
const routes = [
  {
    path: "/accelerate-chicago-2026/masterclasses/590/from-code-assistants-to-autonomous-agents",
    expect: "From Code Assistants to Autonomous Agents",
    speaker: "Cedric Hurst",
  },
  {
    // optional slug omitted — should still resolve
    path: "/accelerate-chicago-2026/sessions/4046",
    expect: "AI Is an Amplifier",
    speaker: null,
  },
  {
    path: "/accelerate-chicago-2026/sessions/9999/does-not-exist",
    expect: "Session not found",
    speaker: null,
  },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
let fail = 0;

for (const r of routes) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BASE + r.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const body = await page.innerText("body");
  const okTitle = body.includes(r.expect);
  const okSpeaker = r.speaker ? body.includes(r.speaker) : true;
  // session-prose should contain rendered list items for real sessions
  const proseHtml = await page
    .$eval(".session-prose", (el) => el.innerHTML)
    .catch(() => "");
  const hasRenderedHtml = r.expect.includes("not found")
    ? true
    : /<li|<ul|<h2|<p/i.test(proseHtml);
  const imgs = await page.$$eval("img", (els) =>
    els.filter((e) => (e.currentSrc || e.src) && e.naturalWidth === 0).length,
  );
  const slug = r.path.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
  await page.screenshot({ path: `.scratch/det_${slug}.png`, fullPage: true });
  const pass = okTitle && okSpeaker && hasRenderedHtml && errors.length === 0 && imgs === 0;
  if (!pass) fail++;
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${r.path}\n   title:${okTitle} speaker:${okSpeaker} htmlRendered:${hasRenderedHtml} brokenImgs:${imgs} errors:${errors.length}${errors.length ? " -> " + errors.slice(0, 2).join(" | ") : ""}`,
  );
  page.removeAllListeners("pageerror");
  page.removeAllListeners("console");
}

await browser.close();
console.log(fail === 0 ? "\nALL DETAIL ROUTES PASS" : `\n${fail} FAILED`);
process.exit(fail === 0 ? 0 : 1);

import { chromium } from "playwright";

const BASE = "http://localhost:5173";
const routes = [
  { path: "/", expect: "Accelerate Chicago" },
  { path: "/speakers", expect: "Scott Hanselman" },
  { path: "/speakers/scott-hanselman", expect: "Microsoft" },
  { path: "/schedule?date=2026-06-23", expect: "Conference" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
let fail = 0;

for (const r of routes) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(BASE + r.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const body = await page.innerText("body");
  const ok = body.includes(r.expect);
  const imgs = await page.$$eval("img", (els) =>
    els.map((e) => ({ src: e.currentSrc || e.src, w: e.naturalWidth })),
  );
  const brokenImgs = imgs.filter((i) => i.w === 0 && i.src);
  const slug = r.path.replace(/[^a-z0-9]/gi, "_") || "home";
  await page.screenshot({ path: `.scratch/shot_${slug}.png`, fullPage: true });
  const status = ok && errors.length === 0 ? "PASS" : "FAIL";
  if (status === "FAIL") fail++;
  console.log(
    `${status}  ${r.path}\n   expect "${r.expect}": ${ok}\n   console/page errors: ${errors.length}${errors.length ? " -> " + errors.slice(0, 3).join(" | ") : ""}\n   imgs: ${imgs.length}, broken: ${brokenImgs.length}`,
  );
  page.removeAllListeners("pageerror");
  page.removeAllListeners("console");
}

await browser.close();
console.log(fail === 0 ? "\nALL ROUTES PASS" : `\n${fail} ROUTE(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);

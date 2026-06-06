import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /generate my plan/i }).click();
await page.waitForTimeout(1500);
// wait for all recipe imgs to finish loading
await page.waitForFunction(() => {
  const imgs = Array.from(document.querySelectorAll("img"));
  return imgs.length > 0 && imgs.every((i) => i.complete && i.naturalWidth > 0);
}, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/ctl-plan.png", fullPage: true });
await browser.close();
console.log("imgs ready");

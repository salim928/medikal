import { chromium } from "playwright";
const role = process.argv[2] || "patient";
const out = process.argv[3] || `D:/DSProjects/aids/medicom/dash-${role}.png`;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.addCookies([{ name: "mc-demo", value: role, url: "http://localhost:3011" }]);
const p = await ctx.newPage();
const resp = await p.goto(`http://localhost:3011/dashboard/${role}`, { waitUntil: "networkidle", timeout: 90000 });
// wait for the loading spinner text to disappear
try { await p.waitForFunction(() => !document.body.innerText.includes("Loading your dashboard"), { timeout: 15000 }); } catch {}
await p.waitForTimeout(1500);
console.log("status", resp?.status(), "hasLoading", (await p.content()).includes("Loading your dashboard"));
await p.screenshot({ path: out, fullPage: true });
await b.close();

import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.argv[2], { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(1500);
await p.screenshot({ path: process.argv[3] });
await b.close(); console.log("ok");

import { writeFile } from "node:fs/promises";

const value = process.env.API_URL;
let url;
try {
  url = new URL(value);
} catch {
  console.error("Set API_URL to the deployed API's full HTTP or HTTPS URL.");
  process.exit(1);
}
if (!["http:", "https:"].includes(url.protocol)) {
  console.error("API_URL must use HTTP or HTTPS.");
  process.exit(1);
}

await writeFile(new URL("./config.js", import.meta.url),
  `window.KUDOS_API_URL = ${JSON.stringify(url.toString().replace(/\/$/, ""))};\n`);
console.log("Wrote frontend/config.js from API_URL.");

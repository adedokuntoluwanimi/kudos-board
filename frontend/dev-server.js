import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.WEB_PORT || 4173);
const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/style.css", ["style.css", "text/css; charset=utf-8"]]
]);

createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/config.js") {
    response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
    response.end(`window.KUDOS_API_URL = ${JSON.stringify(process.env.API_URL || "")};`);
    return;
  }
  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404).end();
    return;
  }
  try {
    const content = await readFile(join(directory, file[0]));
    response.writeHead(200, { "Content-Type": file[1] }).end(content);
  } catch (error) {
    response.writeHead(500).end("Could not load Kudos Board.");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Kudos Board frontend: http://localhost:${port}`);
});

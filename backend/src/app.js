import { randomUUID } from "node:crypto";
import express from "express";
import cors from "cors";

function validateKudos(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Send a JSON object with from, to, and message." };
  }

  const fields = {};
  for (const [name, maxLength] of [["from", 50], ["to", 50], ["message", 280]]) {
    if (typeof body[name] !== "string" || !body[name].trim()) {
      return { error: `${name} is required.` };
    }
    fields[name] = body[name].trim();
    if (fields[name].length > maxLength) {
      return { error: `${name} must be ${maxLength} characters or fewer.` };
    }
  }
  return { fields };
}

export function createApp({ store, allowedOrigins = [], logger = console }) {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.includes(origin));
    }
  }));
  app.use(express.json({ limit: "8kb" }));

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.get("/kudos", async (_request, response, next) => {
    try {
      response.json(await store.listRecent());
    } catch (error) {
      next(error);
    }
  });

  app.post("/kudos", async (request, response, next) => {
    const result = validateKudos(request.body);
    if (result.error) {
      response.status(400).json({ error: result.error });
      return;
    }

    const kudos = {
      id: randomUUID(),
      ...result.fields,
      timestamp: new Date().toISOString()
    };
    try {
      await store.create(kudos);
      response.status(201).json(kudos);
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _request, response, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
      response.status(400).json({ error: "Request body must be valid JSON." });
      return;
    }
    logger.error("Kudos API request failed", error);
    response.status(500).json({ error: "Kudos Board could not complete the request. Please try again." });
  });
  return app;
}

import { createApp } from "./app.js";
import { createKudosStore } from "./kudos-store.js";

const PORT = Number(process.env.PORT);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535 || !TABLE_NAME) {
  console.error("Set a valid PORT and DYNAMODB_TABLE_NAME before starting the API.");
  process.exit(1);
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

createApp({ store: createKudosStore(TABLE_NAME), allowedOrigins }).listen(8080, "0.0.0.0", () => {
  console.log("Kudos Board API listening on port 8080");
});

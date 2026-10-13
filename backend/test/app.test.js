import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../src/app.js";
import { createKudosStore } from "../src/kudos-store.js";

const records = [];
const store = {
  async create(item) { records.push(item); return item; },
  async listRecent() { return [...records].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 50); }
};
let server;
let baseUrl;

before(async () => {
  server = createApp({ store, allowedOrigins: ["http://localhost:4173"] }).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test("health and empty list use the public contract", async () => {
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });
  assert.deepEqual(await (await fetch(`${baseUrl}/kudos`)).json(), []);
});

test("valid kudos are created and listed", async () => {
  const response = await fetch(`${baseUrl}/kudos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "http://localhost:4173" },
    body: JSON.stringify({ from: "Ada", to: "Tolu", message: "Great work!" })
  });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:4173");
  const created = await response.json();
  assert.match(created.id, /^[0-9a-f-]{36}$/);
  assert.equal(created.from, "Ada");
  assert.equal(created.to, "Tolu");
  assert.equal(created.message, "Great work!");
  assert.ok(!Number.isNaN(Date.parse(created.timestamp)));
  assert.deepEqual(await (await fetch(`${baseUrl}/kudos`)).json(), [created]);
});

test("invalid kudos return 400 and are not stored", async () => {
  const beforeCount = records.length;
  for (const body of [
    { from: "", to: "Tolu", message: "Hi" },
    { from: "A".repeat(51), to: "Tolu", message: "Hi" },
    { from: "Ada", to: "Tolu", message: "M".repeat(281) }
  ]) {
    const response = await fetch(`${baseUrl}/kudos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).error, "string");
  }
  assert.equal(records.length, beforeCount);
});

test("DynamoDB listing paginates before choosing the newest 50", async () => {
  const sent = [];
  const pages = [
    { Items: [{ id: "old", timestamp: "2026-01-01T00:00:00.000Z" }], LastEvaluatedKey: { id: "old" } },
    { Items: [{ id: "new", timestamp: "2026-02-01T00:00:00.000Z" }] }
  ];
  const pagedStore = createKudosStore("test-table", {
    async send(command) { sent.push(command.input); return pages.shift(); }
  });
  assert.deepEqual((await pagedStore.listRecent()).map((item) => item.id), ["new", "old"]);
  assert.deepEqual(sent[1].ExclusiveStartKey, { id: "old" });
});

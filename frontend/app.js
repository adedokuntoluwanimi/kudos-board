const apiUrl = window.KUDOS_API_URL;
const form = document.querySelector("#kudos-form");
const formError = document.querySelector("#form-error");
const list = document.querySelector("#kudos-list");
const listStatus = document.querySelector("#list-status");

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = !message;
}

async function loadKudos() {
  if (!apiUrl) {
    listStatus.textContent = "Kudos Board needs an API URL in config.js.";
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/kudos`);
    if (!response.ok) throw new Error("Could not load kudos.");
    const kudos = await response.json();
    list.replaceChildren();
    for (const item of kudos) {
      const card = document.createElement("li");
      const names = document.createElement("strong");
      names.textContent = `${item.from} → ${item.to}`;
      const message = document.createElement("p");
      message.textContent = item.message;
      const date = document.createElement("time");
      date.dateTime = item.timestamp;
      date.textContent = new Date(item.timestamp).toLocaleString();
      card.append(names, message, date);
      list.append(card);
    }
    listStatus.textContent = kudos.length ? "" : "No kudos yet. Be the first to post one.";
  } catch (error) {
    listStatus.textContent = "Could not load kudos. Please refresh and try again.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showFormError("");
  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const fields = Object.fromEntries(new FormData(form));
    const response = await fetch(`${apiUrl}/kudos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not post kudos.");
    form.reset();
    await loadKudos();
  } catch (error) {
    showFormError(error.message || "Could not post kudos. Please try again.");
  } finally {
    button.disabled = false;
  }
});

loadKudos();

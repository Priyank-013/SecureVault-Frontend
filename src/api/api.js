const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

async function parseError(response) {
  try {
    const text = await response.text();
    return text || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

function handleRateLimit(response) {
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After") || 60;
    throw new Error(`⏳ Too many requests! Please wait ${retryAfter} seconds.`);
  }
  return response;
}

export const api = {
  register: (email, password) =>
    fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handleRateLimit),

login: (email, password) =>
  fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(async (res) => {
    if (!res.ok) {
      const errorText = await parseError(res);
      throw new Error(errorText);
    }
    return res;
  }),

  getSecrets: (token) =>
    fetch(`${API_BASE}/secrets`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }).then(handleRateLimit),

  addSecret: (token, name, value) =>
    fetch(`${API_BASE}/secrets`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name, value }),
    }).then(handleRateLimit),

  deleteSecret: (token, id) =>
    fetch(`${API_BASE}/secrets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleRateLimit),

  shareSecret: (token, id) =>
    fetch(`${API_BASE}/secrets/${id}/share`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleRateLimit),

  getLogs: (token, id) =>
    fetch(`${API_BASE}/secrets/${id}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleRateLimit),

  getSharedSecret: (token) =>
    fetch(`${API_BASE}/share/${token}`).then(handleRateLimit),

  parseError,
};
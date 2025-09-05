import { apiRequest } from "./apiClient.js";

// fetch initial data (users, chats, messages)
export async function fetchInitialData() {
  return apiRequest("/data");
}

// send a new message
export async function sendMessage(messagePayload) {
  return apiRequest("/messages", {
    method: "POST",
    body: JSON.stringify(messagePayload),
  });
}

export async function registerUser({ login, fullName }) {
/*
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, fullName }),
  });
  if (!response.ok) throw new Error("Failed to register user");
  return response.json(); // returns created user
*/
  return apiRequest("/register", {
    method: "POST",
    body: JSON.stringify({ login, fullName })
  });
}

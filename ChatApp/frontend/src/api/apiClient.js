import { API_BASE_URL } from '../../config.js'

// generic helper for API requests
export async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
}

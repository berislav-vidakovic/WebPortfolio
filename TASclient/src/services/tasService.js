// tasService.js

const BACKEND_HTTP_URL = import.meta.env.VITE_BACKEND_HTTP_URL;

export async function runTAS() {
  const response = await fetch(`${BACKEND_HTTP_URL}/run-tas`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("TAS request failed");
  }
  return response.json(); // { status, reportUrl }
}

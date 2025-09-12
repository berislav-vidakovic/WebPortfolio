export async function runTAS() {
  const response = await fetch("http://localhost:4000/run-tas", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("TAS request failed");
  }
  return response.json(); // { status, reportUrl }
}

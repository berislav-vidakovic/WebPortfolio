import React, { useState } from "react";
import stripAnsi from "strip-ansi";


function App() {
  const [logs, setLogs] = useState([]);
  const [reportUrl, setReportUrl] = useState("");
  const [showLogs, setShowLogs] = useState(true);

  const handleRunTAS = () => {
    // Clear previous logs and hide report
    setLogs([]);
    setReportUrl("");
    setShowLogs(true);

    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to TAS logs WebSocket");
    };

  ws.onmessage = (event) => {
    try {
      // Try parsing JSON for TAS finished signal
      const data = JSON.parse(event.data);
      if (data.done) {
        setReportUrl(`http://localhost:4000${data.reportUrl}`);
        setShowLogs(false); // hide logs when TAS finished
      }
    } catch {
      // Regular log line
      let line = stripAnsi(event.data);       // remove ANSI escape codes
      line = line.trim();                     // remove extra whitespace

      // Filter out unwanted lines
      if (line === "" || line.startsWith("[dotenv")) return;

      setLogs((prev) => [...prev, line]);
    }
  };


    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Test Automation Frontend</h1>
      <button onClick={handleRunTAS}>Run TAS</button>

      {showLogs && (
        <div
          style={{
            marginTop: "1rem",
            maxHeight: "300px",
            overflowY: "auto",
            fontFamily: "monospace",
            background: "#f8f8f8",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          {logs.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {reportUrl && (
        <iframe
          src={reportUrl}
          title="TAS Report"
          style={{
            width: "100%",
            height: "500px",
            marginTop: "1rem",
            border: "1px solid #ccc",
          }}
        />
      )}
    </div>
  );
}

export default App;

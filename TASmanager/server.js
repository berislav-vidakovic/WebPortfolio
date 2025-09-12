// server.js
import express from "express";
import { spawn } from "child_process";
import path from "path";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Serve reports folder
app.use("/reports", express.static(path.join(__dirname, "reports")));

// HTTP endpoint (optional ping)
app.get("/ping", (req, res) => res.send("pong"));

// WebSocket server
const wss = new WebSocketServer({ noServer: true });

app.post("/run-tas", (req, res) => {
  res.json({ status: "TAS started" }); // Immediately respond to HTTP call
});

// Upgrade HTTP to WebSocket for streaming logs
const server = app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (ws) => {
  console.log("Frontend connected to WebSocket for TAS logs");

  // Spawn TAS using npm script instead of Docker
  // run in project root where package.json is
  let cwdTAS = path.join(__dirname, "./TAS");
  const tasProcess = spawn("npm", ["run", "testChatAppHeadless"], {
    shell: true,
    cwd: cwdTAS, 
  });
  
  tasProcess.stdout.on("data", (chunk) => {
    ws.send(chunk.toString()); // send each log line
  });

  tasProcess.stderr.on("data", (chunk) => {
    ws.send(`ERROR: ${chunk.toString()}`);
  });

  tasProcess.on("exit", () => {
    const reportsDir = path.join(cwdTAS, "playwright-report");
    const oldPath = path.join(reportsDir, "index.html");    
    const reportName = `ReportChatAppTAS_${Date.now()}.html`;
    const newPath = path.join(__dirname, "reports", reportName);
    console.log("newPath:", newPath);

    // Small polling loop to wait until Playwright finishes writing index.html
    const checkReport = setInterval(() => {
      console.log("Polling for Report...in ", oldPath);
      if (fs.existsSync(oldPath)) {
        clearInterval(checkReport);
        fs.renameSync(oldPath, newPath);
        ws.send(JSON.stringify({ done: true, reportUrl: `/reports/${reportName}` }));
        ws.close();
      }
    }, 500); // check every 0.5s
  });
});

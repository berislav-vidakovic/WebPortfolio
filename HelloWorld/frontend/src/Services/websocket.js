// src/Services/websocket.js
export function createWebSocket(url, onMessage, onOpen, onClose, onError) {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connected");
    //TODO: update status
    document.getElementById("status").textContent = "✅ WebSocket connected";
    if (onOpen) onOpen(socket);
  };

  socket.onmessage = (event) => {
    console.log("Received WS message:", event.data);
    document.getElementById("status").textContent = "✅ WebSocket message received";

    if (onMessage) onMessage(event.data);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    if (onClose) onClose();
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (onError) onError(error);
  };

  return socket;
}

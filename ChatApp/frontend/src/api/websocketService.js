import { WEB_SOCKET_URL } from '../../config.js'


let socket = null;
let messageHandlers = [];

export function connectWebSocket(user, onOpen, onClose, onError) {
  if (!user) return;

  socket = new WebSocket(WEB_SOCKET_URL);

  socket.onopen = () => {
    console.log("WebSocket connected for", user.login);
    if (onOpen) onOpen();
  };

  socket.onclose = () => {
    console.log("WebSocket closed for", user.login);
    if (onClose) onClose();
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    if (onError) onError(err);
  };

  socket.onmessage = (event) => {
    const raw = JSON.parse(event.data);

    const normalizedMsg = {
      msgId: raw.MsgId,
      chatId: raw.ChatId,
      userId: raw.UserId,
      datetime: raw.DateTime,
      text: raw.Text,
    };

    // Notify all subscribers
    messageHandlers.forEach((handler) => handler(normalizedMsg));
  };

  return socket;
}

export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function subscribeToMessages(handler) {
  messageHandlers.push(handler);
  return () => {
    messageHandlers = messageHandlers.filter((h) => h !== handler);
  };
}

export function sendWebSocketMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("WebSocket not connected, message not sent:", message);
  }
}

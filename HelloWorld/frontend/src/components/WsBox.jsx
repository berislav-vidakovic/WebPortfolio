import { useState, useEffect, useRef } from "react";
import { createWebSocket } from "../Services/websocket.js";
import { WEB_SOCKET_URL } from "../config.js";
import wsImg from "../assets/socket.png";

export default function WsBox() {
  const [textareaValueWS, setTextareaValueWS] = useState("Hello world!");
  const wsRef = useRef(null);

  const handleSendWS = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending WS message:", textareaValueWS);
      wsRef.current.send(textareaValueWS);
    }
  };

  useEffect(() => {
    wsRef.current = createWebSocket(
      WEB_SOCKET_URL,
      (msg) => setTextareaValueWS(msg)
    );

    return () => {
      console.log("Closing WebSocket on unmount");
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="box">
      <p className="boxtitle">
        <b>Realtime refresh with WebSocket</b>
        <img src={wsImg} className="imgTools" />
      </p>
      <textarea
        value={textareaValueWS}
        onChange={(e) => setTextareaValueWS(e.target.value)}
        className="textarea"
      />
      <button onClick={handleSendWS} className="button button-orange">
        Send
      </button>
    </div>
  );
}

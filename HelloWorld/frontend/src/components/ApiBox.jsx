import { useState } from "react";
import { sendApiMessage } from "../Services/api.js";
import apiImg from "../assets/api.png";

export default function ApiBox() {
  const [textareaValueAPI, setTextareaValueAPI] = useState("Hello world!");

  const handleSendAPI = async () => {
    try {
      console.log("Sending API message:", textareaValueAPI);
      const result = await sendApiMessage("POST", textareaValueAPI);
      console.log("API response:", result);
    } catch (error) {
      console.error("Failed to send API message:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      console.log("Refreshing data ...");
      const result = await sendApiMessage("GET");
      if (result && result.content !== undefined) {
        setTextareaValueAPI(result.content);
      }
    } catch (error) {
      console.error("Failed to refresh API message:", error);
    }
  };

  return (
    <div className="box">
      <p className="boxtitle">
        <b>Simple REST API request</b>
        <img src={apiImg} className="imgTools" />
      </p>
      <textarea
        value={textareaValueAPI}
        onChange={(e) => setTextareaValueAPI(e.target.value)}
        className="textarea"
      />
      <div className="button-row">
        <button onClick={handleSendAPI} className="button">Send</button>
        <button onClick={handleRefresh} className="button">Refresh</button>
      </div>
    </div>
  );
}

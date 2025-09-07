import { useState, useEffect, useRef } from "react";
import { sendApiMessage } from "../Services/api.js";

export default function PollBox() {
  const [textareaValuePoll, setTextareaValuePoll] = useState("Hello world!");
  const [isPolling, setIsPolling] = useState(true); // toggle state
  const POLL_INTERVAL_MS = 5000;

  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const runOnce = async () => {
      if (!mounted || !isPolling) return;

      if (!navigator.onLine) {
        console.log("Offline — retrying in 2s");
        scheduleNext(2000);
        return;
      }

      try {
        console.log("Polling GET ...");
        const result = await sendApiMessage("GET");
        if (mounted && result && result.content !== undefined) {
          setTextareaValuePoll(result.content);
        }
      } catch (err) {
        console.warn("Polling error:", err);
      }

      scheduleNext(POLL_INTERVAL_MS);
    };

    const scheduleNext = (delay) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(runOnce, delay);
    };

    const handleVisibilityChange = () => {
      if (!isPolling) return;
      if (document.visibilityState === "visible") {
        if (timerRef.current) clearTimeout(timerRef.current);
        runOnce();
      } else {
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (isPolling) runOnce();

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPolling]);

  return (
    <div className="box">
      <p className="boxtitle">
        <b>Polling with Interval of 5s </b>

        {/* Toggle switch */}
        <label className="switch">
          <input
            type="checkbox"
            checked={isPolling}
            onChange={(e) => setIsPolling(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </p>

      <input
        value={textareaValuePoll}
        onChange={(e) => setTextareaValuePoll(e.target.value)}
        className="textarea"
      />
      
    </div>
  );
}

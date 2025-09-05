import { useState } from "react";

function ChatWindow({ chat, users, currentUser, messages, onSendMessage }) {
  const [newMessageText, setNewMessageText] = useState("");

  const handleSend = () => {
    if (!newMessageText.trim()) return;
    onSendMessage(newMessageText.trim());
    setNewMessageText("");
  };

  return (
    <section className="chat-window">
      <h2>
        {chat.userIds
          .map(
            (uid) =>
              users.find((u) => u.userId === uid)?.fullName || `User ${uid}`
          )
          .join(", ")}
      </h2>
      <div className="messages">
        {messages.map((m) => {
          const user = users.find((u) => u.userId === m.userId);
          const isYou = m.userId === currentUser.userId;
          const msgDate = new Date(m.datetime);
          return (
            <div
              key={m.msgId}
              className={`message-bubble ${isYou ? "you" : "other"}`}
            >
              <div className="message-text">{m.text}</div>
              <div className="message-meta">
                <span>{isYou ? "You" : user?.fullName}</span>
                <span>
                  {isNaN(msgDate)
                    ? ""
                    : msgDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="message-input">
        <textarea
          placeholder="Type a message..."
          rows={1}
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          onInput={(e) => {
            const target = e.target;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
        ></textarea>
        <button onClick={handleSend}>Send</button>
      </div>
    </section>
  );
}

export default ChatWindow;

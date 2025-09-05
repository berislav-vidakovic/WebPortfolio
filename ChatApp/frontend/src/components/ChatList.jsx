import reactLogo from "../assets/react.png"
import js from "../assets/js12.png"
import node from "../assets/node.png"
import cs from "../assets/cs.png"
import dotnet from "../assets/DotNet.png"
import db from "../assets/postgresqlb.png"

function ChatList({ chats, users, selectedChatID, onSelectChat }) {
  return (
    <section className="chat-list">
      <h2>Chats</h2>
      <ul>
        {chats.map((chat) => {
          const chatUsers = chat.userIds
            .map(
              (uid) =>
                users.find((u) => u.userId === uid)?.fullName || `User ${uid}`
            )
            .join(", ");
          return (
            <li
              key={chat.chatId}
              onClick={() => onSelectChat(chat.chatId)}
              className={selectedChatID === chat.chatId ? "active-chat" : ""}
            >
              {chatUsers}
            </li>            
          );
        })}
      </ul>
      <hr />
      <br />
<p>App built using:</p>
      <img src={reactLogo} className="imgTools" />
      <img src={node} className="imgTools" />
      <img src={js} className="imgTools" />
      <img src={dotnet} className="imgTools" />
      <img src={cs} className="imgTools" />
      <img src={db} className="imgTools" />
      

    </section>
  );
}

export default ChatList;

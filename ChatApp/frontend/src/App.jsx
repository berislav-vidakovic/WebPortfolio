import { useEffect, useState } from "react";
import "./App.css";
import { fetchInitialData, sendMessage, registerUser } from "./api/messageService.js";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToMessages,
} from "./api/websocketService.js";

import LoginDialog from "./components/LoginDialog.jsx";
import ChatList from "./components/ChatList.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import RegisterDialog from "./components/RegisterDialog";


function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChatID, setSelectedChatID] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);


  // Fetch initial data
  useEffect(() => {
    fetchInitialData()
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Auto-select first chat
  useEffect(() => {
    if (data && currentUser && selectedChatID === null) {
      const firstChat = data.chats.find((c) =>
        c.userIds.includes(currentUser.userId)
      );
      if (firstChat) setSelectedChatID(firstChat.chatId);
    }
  }, [data, currentUser, selectedChatID]);

  // WebSocket setup
  useEffect(() => {
    if (!currentUser) return;

    connectWebSocket(currentUser);

    // Subscribe to new messages
    const unsubscribe = subscribeToMessages((newMsg) => {
      setData((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg],
        chats: prev.chats.map((c) =>
          c.chatId === newMsg.chatId
            ? { ...c, messages: [...(c.messages || []), newMsg] }
            : c
        ),
      }));
    });

    return () => {
      unsubscribe();
      disconnectWebSocket();
    };
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const userChats = currentUser
    ? data.chats.filter((c) => c.userIds.includes(currentUser.userId))
    : [];

  const selectedChat =
    currentUser && selectedChatID
      ? userChats.find((c) => c.chatId === selectedChatID)
      : null;

  const messages = selectedChat
    ? data.messages.filter((m) => m.chatId === selectedChatID)
    : [];

  const handleLoginConfirm = (user) => {
    setCurrentUser(user);
    setShowLoginDialog(false);
    const firstChat = data.chats.find((c) =>
      c.userIds.includes(user.userId)
    );
    if (firstChat) setSelectedChatID(firstChat.chatId);
  };

  const handleSendMessage = async (text) => {
    if (!text || !selectedChat || !currentUser) return;

    const messagePayload = {
      ChatId: selectedChat.chatId,
      UserId: currentUser.userId,
      DateTime: new Date().toISOString(),
      Text: text,
    };

    try {
      await sendMessage(messagePayload);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  const handleRegisterClick = () => setShowRegisterDialog(true);

  const handleRegisterConfirm = async (newUser) => {
    try {
      const createdUser = await registerUser(newUser); // call API
      // Update local data.users list
      setData((prev) => ({
        ...prev,
        users: [...prev.users, createdUser]
      }));
      setShowRegisterDialog(false);
      alert(`User "${createdUser.login}" registered successfully!`);
    } catch (err) {
      console.error(err);
      alert("Failed to register user: ", err );
    }
  };



  return (
    <main className="app-container">
       <header className="top-bar">
        <button id="btnLogin" onClick={() => setShowLoginDialog(true)}>
          Login
        </button>
        <button id="btnRegister" onClick={handleRegisterClick}>Register</button>
        {currentUser &&
          <div className="welcome"> 
           <span><small>Logged in as: </small> {currentUser.fullName} &nbsp;</span>
              <button id="btnNewChat" onClick={() => setShowNewChatDialog(true)}>
                New Chat
            </button> 
          </div>
        }
      </header>

      {showLoginDialog && (
        <LoginDialog
          users={data.users}
          onCancel={() => setShowLoginDialog(false)}
          onConfirm={handleLoginConfirm}
        />
      )}

      {showRegisterDialog && (
        <RegisterDialog
          onCancel={() => setShowRegisterDialog(false)}
          onConfirm={handleRegisterConfirm}
        />
      )}

      {currentUser && (
        <div className="main-frame">
          {userChats.length > 0 && (
            <ChatList
              chats={userChats}
              users={data.users}
              selectedChatID={selectedChatID}
              onSelectChat={setSelectedChatID}
            />
          )}

          {selectedChat && (
            <ChatWindow
              chat={selectedChat}
              users={data.users}
              currentUser={currentUser}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      )}
    </main>
  );
}

export default App;

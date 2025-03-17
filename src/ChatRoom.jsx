import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// 连接到后端服务器
const socket = io("http://localhost:3001");

function ChatRoom() {
  // 状态管理：消息列表和输入框内容
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // WebSocket 实时通信：监听消息
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  // 事件处理：发送消息
  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="输入消息..."
        />
        <button onClick={sendMessage}>发送</button>
      </div>
    </div>
  );
}

export default ChatRoom;

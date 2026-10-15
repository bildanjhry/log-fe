import { useEffect, useRef, useState } from "react"


type Message = {
  senderId: string;
  receiverId: string;
  message: string;
  type: "chat";
};


function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null)

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId") ?? "user-1";
  const receiverId = params.get("to") ?? "user-2";

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/chat?userId=${encodeURIComponent(userId)}`)
    socketRef.current = socket

    socket.onopen = () => {
      console.log("Websocket Connected")
      setConnected(true)
    }

    socket.onmessage = (event) => {
      console.log("Message:", event);
      const data: Message = JSON.parse(event.data)

      setMessages((previous) => [
        ...previous,
        data,
      ]);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected")
      setConnected(false)
    }

    socket.onerror = (error) => {
      console.log("Websocket Error ", error)
    }

    return () => {
      socket.close()
    }

  },[userId])

  function sendMessage () {
    const socket = socketRef.current;

    if (socket?.readyState !== WebSocket.OPEN) {
      return;
    }

    if (!message.trim()) {
      return;
    }

    const payload: Message = {
      senderId: "user-1",
      receiverId,
      message: message.trim(),
      type: "chat",
    };

    socket.send(JSON.stringify(payload));
    setMessage("");
  };

  return (
    <div>
    <h1>Log Chat</h1>
    {connected ? <h4>Connected</h4> : <h4>Disconnected</h4>}
    <div>
      {messages.map((item, index) => (
        <p key={index}>
          <strong>{item.senderId}:</strong> {item.message}
        </p>
      ))}
    </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tulis pesan..."
        />

        <button type="submit" disabled={!connected}>
          Kirim
        </button>
      </form>
    </div>
  )
}

export default App

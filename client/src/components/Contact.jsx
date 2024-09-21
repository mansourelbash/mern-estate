import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Set up the socket connection
const socket = io('http://localhost:3000');

const Contact = ({ listing, currentUser, token }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const sellerId = listing.userRef;
  // console.log(sellerId,'sellerId')
  // console.log(listing._id,'listing._id')
  // console.log(currentUser._id,'currentUser._id')
  // console.log(currentUser,'currentUser')
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${listing._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.chats);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '') return;
    console.log(currentUser._id,'currentUser_id')
    console.log(messages,'msg.senderId')
    const messageData = {
      message,
      listingId: listing._id,
      senderId: currentUser._id,
      currentId: currentUser._id,
      currentUserName: currentUser.username,
      receiverId: sellerId, // Ensure this is the correct user ID of the receiver
    };

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      if (data.success) {
        socket.emit('sendMessage', messageData);
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    socket.emit('joinRoom', listing._id);
    fetchMessages();

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [listing._id]);

  return (
    <div className="contact-form">
      <h3>Real-time Chat with the Seller</h3>
      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.senderId._id === currentUser._id ? 'sent' : 'received'}`}
            style={{
              color: msg.senderId._id === currentUser._id ? 'blue' : 'green', // Change colors as needed
            }}
          >
            <strong>
              {msg.senderId._id === currentUser._id ? currentUser.username + '( Me )' : msg.currentUserName}:
            </strong>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Contact;

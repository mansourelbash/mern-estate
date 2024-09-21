import { useEffect, useState } from 'react';

const Messages = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  // Fetch messages from the server
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${currentUser._id}`, {
        headers: {},
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.chats);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentUser]);

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedMessage) return;

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify({
          listingId: selectedMessage.listingId,
          senderId: selectedMessage.receiverId,
          receiverId: selectedMessage.senderId,
          message: replyMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReplyMessage(''); // Clear the reply input
        fetchMessages(); // Re-fetch messages to update the list
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div>
      <h2>Your Messages</h2>
      <div>
        {messages.map((msg) => {
          let backgroundColor;
          // Check who sent the message
          if (msg.senderId === currentUser._id) {
            backgroundColor = '#e1f5fe'; // Seller's message (current user)
          } else if (msg.receiverId === currentUser._id) {
            backgroundColor = '#ffe0b2'; // Buyer's message (received by current user)
          } else {
            backgroundColor = '#ffffff'; // Other messages
          }

          return (
            <div
              key={msg._id}
              style={{
                backgroundColor,
                margin: '10px 0',
                padding: '10px',
                borderRadius: '8px',
                alignSelf: msg.senderId === currentUser._id ? 'flex-end' : 'flex-start',
              }}
            >
              <p>{msg.message}</p>
              <button onClick={() => setSelectedMessage(msg)}>Reply</button>
            </div>
          );
        })}
      </div>
      {selectedMessage && (
        <div>
          <h3>Replying to: {selectedMessage.message}</h3>
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button onClick={handleReply}>Send Reply</button>
        </div>
      )}
    </div>
  );
};

export default Messages;

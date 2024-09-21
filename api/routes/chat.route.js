import express from 'express';
import Chat from '../models/chat.model.js';
import { verifyToken } from '../utils/verifyUser.js'; // Optional: For user authentication

const router = express.Router();

// POST route to save a new chat message
router.post('/send', verifyToken, async (req, res) => {
  const { listingId, senderId, receiverId, message, currentId, currentUserName } = req.body;

  try {
    const newChat = new Chat({
      currentId,
      listingId,
      senderId,
      receiverId,
      message,
      currentUserName
    });

    const savedChat = await newChat.save();

    return res.status(201).json({
      success: true,
      message: 'Message saved successfully!',
      chat: savedChat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error saving message',
      error: error.message,
    });
  }
});

// GET route to fetch chat messages for a specific listing
router.get('/:listingId', verifyToken, async (req, res) => {
  const { listingId } = req.params;

  try {
    const chats = await Chat.find({ listingId })
      .populate('senderId', 'name email') // Populate sender details
      .populate('receiverId', 'name email') // Populate receiver details
      .sort({ timestamp: 1 }); // Sort by timestamp (oldest first)

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message,
    });
  }
});

export default router;

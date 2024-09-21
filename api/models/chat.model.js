import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    currentUserName: {
        type: String,
        ref: 'User', // Reference to the sender (user)
        required: true,
    },
    currentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the sender (user)
        required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing', // Reference to the listing
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the sender (user)
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the receiver (user)
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the message time
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;

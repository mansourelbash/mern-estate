import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http'; // Import to create server for socket.io
import { Server } from 'socket.io'; // Import Socket.IO
import chatRouter from './routes/chat.route.js';
const cors = require('cors'); // Enable CORS if necessary
app.use(cors()); // Allow cross-origin requests

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();

// Create HTTP server for socket.io
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Set this appropriately for production
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Listen for messages sent by clients
  socket.on('sendMessage', (data) => {
    const { message, listingId, sender, receiver } = data;
    // Broadcast message to the room (listingId)
    io.to(listingId).emit('receiveMessage', {
      message,
      sender,
      receiver,
    });
  });

  // User joins a room (based on listingId)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.json());
app.use(cookieParser());

// Define routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Add this line to use the chat routes
app.use('/api/chat', chatRouter);
// Serve the client app
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.get('/proxy', async (req, res) => {
  const { bbox } = req.query; // Extract bbox from the query parameters

  try {
    const response = await axios.get('https://maps.dls.gov.jo/arcgis/rest/services/DLS/DLS_Cassini/MapServer/export', {
      params: {
        bbox: bbox,
        bboxSR: 102100,
        imageSR: 102100,
        size: '1280,352',
        dpi: 96,
        format: 'png32',
        transparent: true,
        layers: 'show:0,1,2,6',
        f: 'image',
      },
      headers: {
        'Referer': 'https://maps.dls.gov.jo/dlsweb/index.html', // Add the Referer header
      },
    });

    // Set the content type and send the image data
    console.log('Response Data:', response.data);

    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching image');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server with Socket.IO
server.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

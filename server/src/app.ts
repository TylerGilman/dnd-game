import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import profileRoutes from "./routes/profile.routes";

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount auth routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

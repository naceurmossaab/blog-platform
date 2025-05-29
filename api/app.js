require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http');
const { setupSocket } = require('./socket');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// database
const connectDB = require('./db/connect');

//  routers
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const articleRouter = require('./routes/article.route');
const commentRouter = require('./routes/comment.route');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Security & utils
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 150,
  })
);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Blog API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/comments', commentRouter);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start the server
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port, () => {
      setupSocket(io);
      console.log(`🟢 Server listening on port ${port}...`);
    });
  } catch (error) {
  console.log('❌ Failed to start server:', error);
}
};

start();

require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
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

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
  res.send('<h1>Blog API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/comments', commentRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
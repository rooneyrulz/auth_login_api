import express from 'express';
import { createServer } from 'http';
import logger from 'morgan';
import config from 'config';
import mongoose from 'mongoose';

// Import routes
import testRoute from './routes/api';
import userRoute from './routes/api/user';
import authRoute from './routes/api/auth';

const app = express();
const server = createServer(app);

// Setup Http-Logger Middleware
app.use(logger('dev'));

// Express Middleware for Parsing JSON Body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handling CORS Errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorizations, X-Auth-Token'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }

  next();
});

// Use routes
app.use('/api/test', testRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

// Setup Port
app.set('port', process.env.PORT || 5000);

// Use Mongoose Own Promise Library
mongoose.Promise = require('bluebird');

// Connecting to MongoDB
async function init() {
  try {
    const connection = await mongoose.connect(config.get('MONGO_URI'), {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    if (connection) {
      console.log(`connecting to mongodb...`);
      // Listening to server
      await server.listen(app.get('port'), () =>
        console.log(`server running on port ${app.get('port')}...`)
      );
    }
  } catch (error) {
    throw error.message;
  }
}

init();

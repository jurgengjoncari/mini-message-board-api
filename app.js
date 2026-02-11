import 'mongoose';

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';

import './components/auth/passport.config.js';

// Routes
import indexRoutes from './components/index/index.routes.js';
import authRoutes from './components/auth/auth.routes.js';
import messageRoutes from './components/message/message.routes.js';
import userRoutes from './components/user/user.routes.js';

const app = express();

const {
  ORIGIN = 'http://localhost:4200',
  SESSION_SECRET,
  NODE_ENV,
  MONGO_URI = 'mongodb://localhost:27017'
} = process.env;

// Trust the first proxy in production
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    secure: NODE_ENV === 'production',
    proxy: NODE_ENV === 'production' ? true : undefined
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// Apply CORS globally to all routes
app.use(cors({
  origin: ORIGIN,
  credentials: true,
  optionsSuccessStatus: 204
}));

// Define routes AFTER all core middleware
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/', indexRoutes);

// catch 404 and forward to the error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  console.error(`[${new Date().toISOString()}] Error on ${req.method} ${req.url}`);
  console.error(err.stack || err);

  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

export default app;

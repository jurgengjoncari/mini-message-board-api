require('mongoose');
const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  logger = require('morgan'),
  session = require('express-session'),
  passport = require('passport'),
  MongoStore = require('connect-mongo');

require('./components/auth/passport.config');

const indexRoutes = require('./components/index/index.routes'),
  authRoutes = require('./components/auth/auth.routes'),
  messageRoutes = require('./components/message/message.routes'),
  userRoutes = require('./components/user/user.routes');

const app = express();

const { ORIGIN, SESSION_SECRET, NODE_ENV, BACKEND_HOSTNAME, MONGO_URI } = process.env;

// Trust the first proxy in production
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

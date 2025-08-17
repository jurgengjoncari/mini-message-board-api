require('mongoose');
const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  logger = require('morgan');

const indexRoutes = require('./components/index/indexRoutes'),
  authRoutes = require('./components/auth/authRoutes'),
  messageRoutes = require('./components/message/messageRoutes'),
  userRoutes = require('./components/user/userRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/', indexRoutes);

// catch 404 and forward to error handler
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

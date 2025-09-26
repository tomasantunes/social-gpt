var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var secretConfig = require('./secret-config.json');
var axios = require('axios');
var session = require('express-session');

var indexRouter = require('./routes/index');
var viewsRouter = require('./routes/views');
var authRouter = require('./routes/auth');
var botsRouter = require('./routes/bots');
var timelineRouter = require('./routes/timeline');
var userTimelineRouter = require('./routes/user-timeline');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: secretConfig.SESSION_KEY,
  resave: false,
  saveUninitialized: true
}));

app.use("/", indexRouter);
app.use(express.static(path.resolve(__dirname) + '/frontend/dist'));
app.use("/", authRouter);
app.use("/", botsRouter);
app.use("/", timelineRouter);
app.use("/", userTimelineRouter);
app.use("/", viewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

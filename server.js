let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let flash = require('connect-flash');
let passport = require('passport');
require('./config/passport')(passport);
require('./config/database');

//require routers
let indexRouter = require('./routes/index');
let authRouter = require('./routes/auth');
let articlesRouter = require('./routes/articles');

//express
let app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser('secretStringForCookies'));

// express session
// 43200000 millisecond = half a day
app.use(session({
  secret: 'secretStringForSession',
  cookie: { maxAge: 43200000 },
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//set middleware for global flash message
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

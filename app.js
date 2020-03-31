const config = require('config');
var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var staffRouter = require('./routes/routerStaffs');
var diversRouter = require('./routes/routerDivers');
var listsRouter = require('./routes/routerLists');
var usersRouter = require('./routes/routerUsers');
var auth = require('./routes/routesAuth');

//could be done with process.env.jwtPrivateKey
if(!config.get('jwtPrivateKey')){
    console.error("FATAL ERROR jwtPrivateKey not defined");
    process.exit(1);
}


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/staff', staffRouter);
app.use('/manageDiver', diversRouter);
app.use('/lists', listsRouter);
app.use('/users', usersRouter);
app.use('/auth', auth);


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

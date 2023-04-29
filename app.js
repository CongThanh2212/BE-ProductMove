var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Fix Access-Control-Allow-Origin

var general = require('./routes/generalRouter');
var management = require('./routes/managementRouter');
var producer = require('./routes/producerRouter');
var agent = require('./routes/agentRouter');
var service = require('./routes/serviceRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Fix Access-Control-Allow-Origin
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Phân tích cú pháp body trong request type post và điền content đó vào req.body
app.use(express.json())

// Routing
app.use('/general', general);
app.use('/management', management);
app.use('/producer', producer);
app.use('/agent', agent);
app.use('/service', service);

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

app.listen(3001, () => {
  console.log(`Server started on port 3001`);
});

module.exports = app;

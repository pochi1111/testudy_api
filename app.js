var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connection = require('./system/connection');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studyTimesRouter = require('./routes/times');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
connection.connect();
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/times', studyTimesRouter);

app.all("*",(req,res)=>{
   res.json({data:[{error:"Invalid URL"}]})
});

module.exports = app;

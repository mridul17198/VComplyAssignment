var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var authenticate = require('./authenticate');
const mongoose = require('mongoose');

var usersRouter = require('./routes/users');
var approvalRouter = require('./routes/approval');
var actionRouter = require('./routes/actions');

var config = require('./config');

const url = process.env.MONGODB_URL || config.mongoUrl;

// Connecting to the Database
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// Express App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Initializing Passport
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/approval',approvalRouter);
app.use('/actions',actionRouter);

app.listen(3000);
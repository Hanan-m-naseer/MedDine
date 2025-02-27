const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan');
const session = require('express-session');
const userRoute = require('./routers/userRouter')
const adminRoute = require('./routers/adminRoutes')
const nocache = require('nocache')
app.use(morgan('dev'));
app.use(nocache())
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'SECRET123', // Change this to a secure random string
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // Set the session timeout in milliseconds (e.g., 1 hour)
    }
  }));
app.use('/',userRoute)
app.use('/admin',adminRoute)
module.exports = app;


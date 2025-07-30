const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
require('./utils/passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const projectsRouter = require('./routes/projects');


const app = express();

// Enable CORS for localhost:3001
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter); // مهم جداً عشان يشتغل login/register
app.use('/projects', projectsRouter);
// Default 404 handler (اختياري)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;

require('dotenv').config();
const express = require('express');

const passport = require('./db/passport');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');

const app = express();
const path = require('path');
const spotifyRouter = require('./spotifyRouter');

app.set('views', path.join(__dirname, '../dist/views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(bodyparser.json());
app.use(methodOverride());
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: false,
}));

app.use(express.static(path.join(__dirname, '../dist')));

app.use(passport.initialize());
app.use(passport.session());
app.use('/spotify', spotifyRouter);

app.get('/', (req, res) => {
  if (!req.user) {
    res.render('index.pug', { id: 0, spotifyAccessToken: 0 });
  } else {
    res.render('index.pug', { id: req.user.spotifyId, spotifyAccessToken: req.user.spotifyAccessToken });
  }
});

app.get(
  '/auth/spotify', passport.authenticate(
    'spotify',
    { scope: ['user-follow-read', 'user-top-read'], showDialog: true },
  ),
  () => {},
);

app.get('/login', (req, res) => {
  res.render('index.pug', { id: 0, spotifyAccessToken: 0 });
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/auth', ensureAuthenticated, (req, res) => {
  res.render('index.pug', { id: req.user.spotifyId, spotifyAccessToken: req.user.spotifyAccessToken });
});

app.get(
  '/callback', passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/auth');
  },
);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('listening on 3000!'));

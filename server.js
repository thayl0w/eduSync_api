const express = require('express');
const dotenv = require('dotenv');
// Silence dotenv console output during config
(() => {
  const originalConsoleLog = console.log;
  try {
    console.log = () => {};
    dotenv.config();
  } finally {
    console.log = originalConsoleLog;
  }
})();
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const githubCallbackURL = process.env.CALLBACK_URL || `http://localhost:${port}/github/callback`;

// ✅ Trust proxy for secure cookies in production
app.set('trust proxy', 1);

// ✅ Allow Swagger UI to send cookies
app.use(cors({
  origin: `http://localhost:${port}`, // Change to Swagger UI origin
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// ✅ Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Session configuration (cookies!)
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true if using HTTPS
    sameSite: 'lax' // use 'none' if Swagger UI runs on a different domain with HTTPS
  }
}));

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Swagger UI with cookie sending enabled
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    requestInterceptor: (req) => {
      req.credentials = 'include'; // send session cookies
      return req;
    }
  }
}));

// 🔹 Routes
app.use("/", require('./routes/index.js'));

passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: githubCallbackURL,
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Start GitHub OAuth flow
app.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/', session: true }), // ✅ keep session
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/api-docs'); // redirect to Swagger UI
  }
);

// Simple GET logout route for browsers
app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error logging out.' });
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

// 🔹 MongoDB init and server listen
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`EduSync API server listening at http://localhost:${port}`);
    });
  }
});

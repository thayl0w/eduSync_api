const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;

// Configure allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000',                     // Local Swagger/VSCode
  'https://edusync-api-7p52.onrender.com',    // Render deployment
];

// Enable CORS
app.use(cors({
  origin: function(origin, callback){
    if (!origin) return callback(null, true); // allow requests like Postman/curl
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true,
}));

app
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use("/", require('./routes/index.js'));

// Passport GitHub strategy
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);   
});

// Routes
app.get('/', (req, res) => { 
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged Out");
});

app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: false
}),
(req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

// Swagger docs route
app.use('/api-docs', require('./routes/swagger'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server after DB initialization
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is listening and node server is running on port ${port}`);
        });
    }
});
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import { Strategy as GithubStrategy } from 'passport-github2';

dotenv.config();

// ✅ Minimal fix: check env vars before using them
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.CALLBACK_URL) {
  console.error('Missing GitHub OAuth environment variables');
  process.exit(1);
}

const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.send('GitHub Login Successful!');
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

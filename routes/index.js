const router = require('express').Router();
const passport = require('passport');

// Controllers
const usersController = require('../controllers/users'); // matches your actual file name

// Middlewares
const { validateRegistration, validateLogin } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticated');

router.get('/', (req, res) => {
  const displayName = req.session.user
    ? (req.session.user.username || req.session.user.displayName || (req.session.user._json && req.session.user._json.login) || 'GitHub User')
    : null;

  const loginStatus = displayName
    ? `<p>Logged in as ${displayName}</p>`
    : `<p>Logged Out</p>`;

  res.send(`
    <h1>Welcome to the EduSync API</h1>
    ${loginStatus}
    <p>Use the following endpoints to access the API:</p>
    <ul>
      <li><a href="/api-docs">API Documentation (Swagger)</a></li>
      <li><a href="/students">Students</a></li>
      <li><a href="/courses">Courses</a></li>
      <li><a href="/enrollments">Enrollments</a></li>
      <li>${req.session.user ? '<a href="/logout">Logout</a>' : '<a href="/github">Login to GitHub</a>'}</li>
    </ul>
  `);
});

router.use('/students', require('./students'));
router.use('/courses', require('./courses'));
router.use('/enrollments', require('./enrollments'));

// Auth routes
// #swagger.tags = ['Users']
router.post('/register', validateRegistration, usersController.registerUser);

// #swagger.tags = ['Users']
router.post('/login', validateLogin, usersController.loginUser);

// #swagger.tags = ['Users']
router.post('/logout', usersController.logoutUser);

// Protected route
router.get('/protected', isAuthenticated, (req, res) => {
  // #swagger.tags = ['Users']
  res.json({ message: `Hello, ${req.session.user.username}. You are viewing a protected route!` });
});

module.exports = router;
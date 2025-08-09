const router = require('express').Router();
const passport = require('passport');

// Controllers
const usersController = require('../controllers/users'); // matches your actual file name

// Middlewares
const { validateRegistration, validateLogin } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticated');

router.get('/', (req, res) => {
  const loginStatus = req.session.user
    ? `<p>Logged in as ${req.session.user.username}</p>`
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
      <li><a href="/github">Login to GitHub</a></li>
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
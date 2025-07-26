const fs = require('fs');
const path = require('path');

const folders = [
  'config',
  'controllers',
  'middleware',
  'models',
  'routes',
  'swagger',
  'tests'
];

const files = {
  '.gitignore': 'node_modules\n.env\n',
  '.env': 'PORT=3000\nMONGODB_URI=\nJWT_SECRET=\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\n',
  'server.js': `const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', require('./routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`,
  'routes/index.js': `const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('EduSync API is running...');
});

module.exports = router;
`
};

// Create folders
folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
    console.log('Created folder:', folder);
  }
});

// Create files
for (const [fileName, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, fileName);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log('Created file:', fileName);
  }
}

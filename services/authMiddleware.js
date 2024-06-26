// serviecs/authMiddleware.js
// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

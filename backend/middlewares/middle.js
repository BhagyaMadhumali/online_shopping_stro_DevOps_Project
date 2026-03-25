// backend/middlewares/middle.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKeyHere123!';

function middle(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please login to continue.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Please login to continue.' });
  }
}

module.exports = middle;

// middleware/roleMiddleware.js
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

exports.isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only regular users can perform this action' });
  }
  if (req.user.isSuspended) {
    return res.status(403).json({ message: 'Account suspended' });
  }
  next();
};

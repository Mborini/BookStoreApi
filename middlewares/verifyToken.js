const jwt = require("jsonwebtoken");
//varifyToken
function verifyToken(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // قم بتخزين معلومات المستخدم في الطلب إذا لزم الأمر
    next(); // استمر في المعالجة
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
}

function verifyTokenAndAAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAAdmin,
};

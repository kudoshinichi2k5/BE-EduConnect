const admin = require("../config/firebase");
const UserService = require("../services/user_service");

const verifyFirebaseToken = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await UserService.getByUid(decoded.uid);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      role: user ? user.role : null
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Chỉ admin mới được phép" });
  }
  next();
};

module.exports = {
  verifyFirebaseToken,
  requireAdmin
};

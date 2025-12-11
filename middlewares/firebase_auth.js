const admin = require("../config/firebase");

const verifyFirebaseToken = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Thiếu token hoặc token không hợp lệ" });
    }

    const token = authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Firebase Auth Error:", error);
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};

module.exports = verifyFirebaseToken;

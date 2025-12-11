const admin = require("../config/firebase");
const UserService = require("../services/user_service");

/**
 * Middleware: Verify Firebase ID Token
 * - Kiểm tra token trong Authorization header
 * - Decode token và lấy thông tin user từ Firebase
 * - Lấy thêm role từ MySQL để phục vụ authorization
 */
const verifyFirebaseToken = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ 
            message: "Thiếu token hoặc token không đúng định dạng",
            hint: "Header cần có dạng: Authorization: Bearer <token>"
        });
    }

    const token = authorization.split(" ")[1];

    try {
        // Verify token với Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Lấy thêm thông tin role từ MySQL để phục vụ authorization
        const userInDb = await UserService.getByFirebaseUid(decodedToken.uid);
        
        // Nếu user chưa có trong DB thì role = null
        // Controller sẽ xử lý logic tiếp (ví dụ: yêu cầu register)
        
        // Attach user info vào request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || null,
            role: userInDb ? userInDb.role : null,
            firebaseUser: decodedToken // Giữ lại full info từ Firebase nếu cần
        };

        next();
    } catch (error) {
        console.error("Firebase Auth Error:", error);
        
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ 
                message: "Token đã hết hạn. Vui lòng đăng nhập lại",
                code: "TOKEN_EXPIRED"
            });
        }
        
        if (error.code === 'auth/argument-error') {
            return res.status(401).json({ 
                message: "Token không hợp lệ",
                code: "INVALID_TOKEN"
            });
        }

        if (error.code === 'auth/id-token-revoked') {
            return res.status(401).json({ 
                message: "Token đã bị thu hồi. Vui lòng đăng nhập lại",
                code: "TOKEN_REVOKED"
            });
        }

        return res.status(401).json({ 
            message: "Xác thực thất bại",
            code: error.code || "AUTH_ERROR"
        });
    }
};

/**
 * Middleware: Require Admin Role
 * - Phải dùng SAU verifyFirebaseToken
 * - Kiểm tra role trong req.user (đã được load từ MySQL)
 */
const requireAdmin = (req, res, next) => {
    // Kiểm tra xem đã có req.user chưa (được set bởi verifyFirebaseToken)
    if (!req.user) {
        return res.status(401).json({ 
            message: "Chưa xác thực. Vui lòng đăng nhập",
            hint: "Middleware verifyFirebaseToken phải được gọi trước requireAdmin"
        });
    }

    // Kiểm tra role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: "Bạn không có quyền truy cập tính năng này",
            required: "admin",
            current: req.user.role || "không xác định"
        });
    }

    next();
};

/**
 * Middleware: Require Student Role
 * - Phải dùng SAU verifyFirebaseToken
 * - Kiểm tra role trong req.user
 */
const requireStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            message: "Chưa xác thực. Vui lòng đăng nhập",
            hint: "Middleware verifyFirebaseToken phải được gọi trước requireStudent"
        });
    }

    if (req.user.role !== 'student') {
        return res.status(403).json({ 
            message: "Tính năng này chỉ dành cho học sinh/sinh viên",
            required: "student",
            current: req.user.role || "không xác định"
        });
    }

    next();
};

/**
 * Middleware: Optional Authentication
 * - Verify token nếu có
 * - Không bắt buộc phải có token (không throw error nếu thiếu token)
 * - Hữu ích cho các endpoint public nhưng muốn biết user đã login chưa
 * 
 * Ví dụ use case: Xem danh sách opportunities
 * - Nếu có token: trả về kèm thông tin đã bookmark chưa
 * - Nếu không có token: chỉ trả về danh sách opportunities
 */
const optionalAuth = async (req, res, next) => {
    const authorization = req.headers.authorization;

    // Không có token -> set user = null và continue
    if (!authorization || !authorization.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userInDb = await UserService.getByFirebaseUid(decodedToken.uid);
        
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || null,
            role: userInDb ? userInDb.role : null,
            firebaseUser: decodedToken
        };
    } catch (error) {
        // Token không hợp lệ -> ignore, set user = null
        console.warn("Optional auth - Invalid token:", error.message);
        req.user = null;
    }

    next();
};

/**
 * Middleware: Check if user owns resource or is admin
 * - Dùng để check quyền truy cập resource (ví dụ: update profile, delete bookmark...)
 * - User chỉ có thể thao tác với resource của chính mình
 * - Admin có thể thao tác với mọi resource
 * 
 * @param {String} resourceUidField - Tên field trong req.params chứa uid của resource owner
 * 
 * Ví dụ: 
 * router.put('/:id', verifyFirebaseToken, checkOwnership('id'), updateUser)
 */
const checkOwnership = (resourceUidField = 'id') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: "Chưa xác thực. Vui lòng đăng nhập"
            });
        }

        const resourceUid = req.params[resourceUidField];
        const requesterId = req.user.uid;
        const requesterRole = req.user.role;

        // Admin được phép thao tác với mọi resource
        if (requesterRole === 'admin') {
            return next();
        }

        // User thường chỉ được thao tác với resource của chính mình
        if (requesterId !== resourceUid) {
            return res.status(403).json({ 
                message: "Bạn không có quyền thao tác với resource này",
                hint: "Chỉ chủ sở hữu hoặc admin mới có quyền"
            });
        }

        next();
    };
};

module.exports = {
    verifyFirebaseToken,
    requireAdmin,
    requireStudent,
    optionalAuth,
    checkOwnership
};
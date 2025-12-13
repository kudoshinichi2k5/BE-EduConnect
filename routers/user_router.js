const router = require('express').Router();
const userController = require('../controllers/user_controller');
const { verifyFirebaseToken, requireAdmin } = require('../middlewares/firebase_auth');

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: API quản lý người dùng
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Đăng ký profile người dùng vào MySQL sau khi tạo tài khoản Firebase
 *     description: |
 *       Flow đăng ký đúng:
 *       1. Client tạo tài khoản trên Firebase Authentication
 *       2. Client nhận được Firebase UID
 *       3. Client gọi API này để lưu thông tin profile vào MySQL
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - username
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Firebase UID nhận được từ Firebase Auth
 *                 example: "abc123xyz456firebase"
 *               email:
 *                 type: string
 *                 example: "student@uit.edu.vn"
 *               username:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               school:
 *                 type: string
 *                 example: "UIT"
 *               role:
 *                 type: string
 *                 enum: [student, admin]
 *                 default: student
 *               avatar:
 *                 type: string
 *                 example: "https://firebasestorage.googleapis.com/..."
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thiếu dữ liệu
 *       409:
 *         description: User đã tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Verify Firebase token và lấy thông tin user
 *     description: |
 *       LƯU Ý:
 *       - Endpoint này KHÔNG xử lý đăng nhập
 *       - Firebase Authentication đã xử lý login
 *       - API này chỉ verify token và trả về profile user trong MySQL
 *
 *       Flow:
 *       1. Client login Firebase
 *       2. Client lấy Firebase ID Token
 *       3. Gửi token qua header Authorization
 *       4. Backend verify token và trả về user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       404:
 *         description: User chưa tạo profile
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/login', verifyFirebaseToken, userController.login);

/**
 * @swagger
 * /user/role/student:
 *   get:
 *     summary: Lấy danh sách học sinh / sinh viên
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/role/student', verifyFirebaseToken, userController.getStudents);

/**
 * @swagger
 * /user/role/admin:
 *   get:
 *     summary: Lấy danh sách admin
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền (chỉ admin)
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/role/admin', verifyFirebaseToken, requireAdmin, userController.getAdmins);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (Admin only)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/', verifyFirebaseToken, requireAdmin, userController.getAll);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo UID
 *     description: |
 *       - User chỉ xem được thông tin của chính mình
 *       - Admin có thể xem tất cả
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123xyz456firebase"
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/:id', verifyFirebaseToken, userController.getUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     description: |
 *       - User chỉ được cập nhật chính mình
 *       - Admin có thể cập nhật bất kỳ user nào
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Nguyễn Văn B"
 *               school:
 *                 type: string
 *                 example: "HCMUTE"
 *               role:
 *                 type: string
 *                 enum: [student, admin]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi hệ thống
 */
router.put('/:id', verifyFirebaseToken, userController.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Xóa người dùng (Admin only)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123xyz456firebase"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete('/:id', verifyFirebaseToken, requireAdmin, userController.deleteUser);

module.exports = router;

const router = require('express').Router();
const userController = require('../controllers/user_controller');
const firebaseAuth = require('../middlewares/firebase_auth');

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
 *     summary: Đăng ký tài khoản người dùng (Firebase + MySQL)
 *     description: Client tạo tài khoản trên Firebase → gửi uid + email + thông tin profile để lưu vào MySQL.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 example: "FIREBASE_UID_ABC"
 *               email:
 *                 type: string
 *                 example: "test@gmail.com"
 *               hoTen:
 *                 type: string
 *                 example: "Kiên Lê Trung"
 *               school:
 *                 type: string
 *                 example: "UIT"
 *               role:
 *                 type: string
 *                 example: "student"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thiếu dữ liệu gửi lên
 *       409:
 *         description: Người dùng đã tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Xác thực người dùng bằng Firebase token
 *     description: Client gửi Firebase ID Token → Server decode → trả về thông tin user trong MySQL.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "FIREBASE_ID_TOKEN_ABC"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Token không hợp lệ
 *       404:
 *         description: User chưa tạo profile trong MySQL
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo UID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "FIREBASE_UID_ABC"
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/:id', userController.getUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
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
 *               hoTen:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               school:
 *                 type: string
 *                 example: "HCMUTE"
 *               role:
 *                 type: string
 *                 example: "student"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Xóa người dùng (MySQL + Firebase)
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "FIREBASE_UID_ABC"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete('/:id', userController.deleteUser);

/**
 * @swagger
 * /user/{id}/avatar:
 *   patch:
 *     summary: Cập nhật avatar người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 example: "https://firebasestorage.googleapis.com/..."
 *     responses:
 *       200:
 *         description: Cập nhật avatar thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
router.patch('/:id/avatar', userController.updateAvatar);

/**
 * @swagger
 * /user/role/student:
 *   get:
 *     summary: Lấy danh sách học sinh
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/role/student', userController.getStudents);

/**
 * @swagger
 * /user/role/admin:
 *   get:
 *     summary: Lấy danh sách admin
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/role/admin', userController.getAdmins);

module.exports = router;

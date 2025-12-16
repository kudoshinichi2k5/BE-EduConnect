// Liên quan đến cơ hội:
// + Thêm cơ hội (học bổng / sự kiện / cuộc thi)
// + Thêm nhiều cơ hội cùng lúc (Admin)
// + Xem danh sách, chi tiết
// + Cập nhật
// + Xóa

const router = require('express').Router();
const opportunityController = require('../controllers/opportunity_controller');
const { verifyFirebaseToken, requireAdmin } = require('../middlewares/firebase_auth');

/**
 * @swagger
 * tags:
 *   name: Opportunity
 *   description: Các API liên quan tới Cơ hội (Học bổng, Sự kiện, Cuộc thi)
 */

/**
 * @swagger
 * /opportunity:
 *   post:
 *     summary: Tạo mới một cơ hội (Admin)
 *     description: |
 *       API dùng để tạo một cơ hội mới.
 *       Chỉ ADMIN mới có quyền sử dụng.
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *               - Type
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "Học bổng UIT 2025"
 *               Description:
 *                 type: string
 *                 example: "Học bổng dành cho sinh viên xuất sắc"
 *               Content_url:
 *                 type: string
 *                 example: "https://uit.edu.vn/scholarship"
 *               Image_url:
 *                 type: string
 *                 example: "https://example.com/image.png"
 *               Type:
 *                 type: string
 *                 enum: [scholarship, contest, event]
 *                 example: "scholarship"
 *               Deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59"
 *     responses:
 *       201:
 *         description: Tạo cơ hội thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền (Admin only)
 *       500:
 *         description: Lỗi hệ thống
 */
router.post(
    '/',
    verifyFirebaseToken,
    requireAdmin,
    opportunityController.createOpportunity
);

/**
 * @swagger
 * /opportunity/bulk:
 *   post:
 *     summary: Thêm nhiều cơ hội cùng lúc (Admin)
 *     description: |
 *       API cho phép ADMIN thêm một loạt cơ hội cùng lúc
 *       (ví dụ import 20–50 bài từ file hoặc crawler).
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - Title
 *                 - Type
 *               properties:
 *                 Title:
 *                   type: string
 *                   example: "Cuộc thi AI Challenge"
 *                 Description:
 *                   type: string
 *                   example: "Cuộc thi dành cho sinh viên CNTT"
 *                 Content_url:
 *                   type: string
 *                   example: "https://aichallenge.com"
 *                 Image_url:
 *                   type: string
 *                   example: "https://example.com/ai.png"
 *                 Type:
 *                   type: string
 *                   enum: [scholarship, contest, event]
 *                   example: "contest"
 *                 Deadline:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-10T23:59:59"
 *     responses:
 *       201:
 *         description: Thêm danh sách cơ hội thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi hệ thống
 */
router.post(
    '/bulk',
    verifyFirebaseToken,
    requireAdmin,
    opportunityController.createManyOpportunities
);

/**
 * @swagger
 * /opportunity:
 *   get:
 *     summary: Lấy danh sách tất cả cơ hội
 *     description: API công khai cho phép người dùng xem danh sách cơ hội.
 *     tags:
 *       - Opportunity
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/', opportunityController.getAll);

/**
 * @swagger
 * /opportunity/{id}:
 *   get:
 *     summary: Lấy chi tiết một cơ hội
 *     tags:
 *       - Opportunity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "OP001"
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy cơ hội
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/:id', opportunityController.getById);

/**
 * @swagger
 * /opportunity/type/{type}:
 *   get:
 *     summary: Lấy cơ hội theo loại
 *     tags:
 *       - Opportunity
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [scholarship, contest, event]
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/type/:type', opportunityController.getByType);

/**
 * @swagger
 * /opportunity/{id}:
 *   put:
 *     summary: Cập nhật cơ hội (Admin)
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "OP001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Không có thay đổi
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi hệ thống
 */
router.put(
    '/:id',
    verifyFirebaseToken,
    requireAdmin,
    opportunityController.updateOpportunity
);

/**
 * @swagger
 * /opportunity/{id}:
 *   delete:
 *     summary: Xóa cơ hội (Admin)
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "OP001"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete(
    '/:id',
    verifyFirebaseToken,
    requireAdmin,
    opportunityController.deleteOpportunity
);

module.exports = router;

const router = require("express").Router();
const bookmarkController = require("../controllers/bookmark_controller");

/**
 * @swagger
 * tags:
 *   - name: Bookmark
 *     description: API quản lý bookmark (Opportunity, Article, ...)
 */

/**
 * @swagger
 * /bookmark/add:
 *   post:
 *     summary: Thêm bookmark (Opportunity / Article)
 *     tags:
 *       - Bookmark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MaNguoiDung
 *               - TargetId
 *               - TargetType
 *             properties:
 *               MaNguoiDung:
 *                 type: string
 *                 example: "abc123firebase"
 *               TargetId:
 *                 type: string
 *                 example: "OP001"
 *               TargetType:
 *                 type: string
 *                 enum: [opportunity, article]
 *                 example: "opportunity"
 *     responses:
 *       201:
 *         description: Bookmark thành công
 *       409:
 *         description: Đã bookmark
 *       404:
 *         description: User hoặc Target không tồn tại
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/add", bookmarkController.addBookmark);

/**
 * @swagger
 * /bookmark/remove:
 *   delete:
 *     summary: Bỏ bookmark (Opportunity / Article)
 *     tags:
 *       - Bookmark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MaNguoiDung
 *               - TargetId
 *               - TargetType
 *             properties:
 *               MaNguoiDung:
 *                 type: string
 *                 example: "abc123firebase"
 *               TargetId:
 *                 type: string
 *                 example: "AR001"
 *               TargetType:
 *                 type: string
 *                 enum: [opportunity, article]
 *                 example: "article"
 *     responses:
 *       200:
 *         description: Bỏ bookmark thành công
 *       404:
 *         description: Bookmark không tồn tại
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete("/remove", bookmarkController.removeBookmark);

/**
 * @swagger
 * /bookmark/check:
 *   get:
 *     summary: Kiểm tra đã bookmark hay chưa
 *     tags:
 *       - Bookmark
 *     parameters:
 *       - in: query
 *         name: MaNguoiDung
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123firebase"
 *       - in: query
 *         name: TargetId
 *         required: true
 *         schema:
 *           type: string
 *           example: "OP001"
 *       - in: query
 *         name: TargetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [opportunity, article]
 *           example: "opportunity"
 *     responses:
 *       200:
 *         description: Trạng thái bookmark
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/check", bookmarkController.checkBookmark);

/**
 * @swagger
 * /bookmark/user/{uid}:
 *   get:
 *     summary: Lấy danh sách bookmark của user (Opportunity + Article)
 *     tags:
 *       - Bookmark
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123firebase"
 *     responses:
 *       200:
 *         description: Danh sách bookmark
 *       400:
 *         description: Thiếu uid
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/user/:uid", bookmarkController.getBookmarksByUser);

module.exports = router;
